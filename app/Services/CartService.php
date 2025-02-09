<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\VariationType;
use App\Models\VariationTypeOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;



class CartService
{
    private ?array $cachedCartItems = null;
    protected const COOKIE_NAME = 'cartItems';
    protected const COOKIE_LIFETIME = 60 * 24 * 365;
    public function addItemToCart(Product $product, int $quantity = 1, array $optionIds = [])
    {
        if (empty($optionIds)) {
            $optionIds = $product->variationTypes
                ->mapWithKeys(fn(VariationType $type) => [$type->id => $type->options[0]?->id])
                ->toArray();
        }

        $price = $product->getPriceForOptions($optionIds);

        // Check if the added quantity exceeds the available stock
        $existingQuantity = 0;
        foreach ($this->getCartItems() as $item) {
            if ($item['product_id'] == $product->id && $item['option_ids'] == $optionIds) {
                $existingQuantity += $item['quantity'];
            }
        }

        $newTotal = $existingQuantity + $quantity;

        if ($newTotal > $product->quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'The quantity exceeds the available stock.'
            ]);
        }

        if (Auth::check()) {
            $this->saveItemToDatabase($product->id, $quantity, $optionIds, $price);
        } else {
            $this->saveItemToCookies($product->id, $quantity, $price, $optionIds);
        }
    }

    public function updateItemQuantity(int $productId, int $quantity,  $optionIds = null)
    {
        if(Auth::check()) {
            $this->updateItemQuantityInDatabase($productId, $quantity, $optionIds);
        } else {
            $this->updateItemQuantityInCookies($productId, $quantity, $optionIds);
        }
    }

    public function removeItemFromCart(int $productId,  $optionIds = null)
    {
        if (Auth::check()) {
            $this->removeItemFromDatabase($productId, $optionIds);
        } else {
            $this->removeItemFromCookies($productId, $optionIds);
        }
    }

    public function getCartItems(): array
    {
        try {
            if ($this->cachedCartItems === null) {
                if (Auth::check()) {
                    //auth user
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    //user is guest
                    $cartItems = $this->getCartItemsFromCookies();
                }

                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);
                $products = Product::whereIn('id', $productIds)
                    ->with('user.vendor')
                    ->forWebsite()
                    ->get()
                    ->keyBy('id');

                $cartItemData = [];
                if (!is_array($cartItems) && !is_object($cartItems)) {
                    $cartItems = [];
                }
                foreach ($cartItems as $key => $cartItem) {
                    $product = data_get($products, $cartItem['product_id']);
                    if (!$product) continue;

                    $optionInfo = [];
                    $options = VariationTypeOption::with('variationType')
                        ->whereIn('id', $cartItem['option_ids'])
                        ->get()
                        ->keyBy('id');

                    $imageUrl = null;

                    foreach ($cartItem['option_ids'] as $option_id) {
                        $option = data_get($options, $option_id);
                        if (!$imageUrl) {
                            $imageUrl = $option->getFirstMediaUrl('images', 'small');
                        }
                        $optionInfo[] = [
                            'id' => $option_id,
                            'name' => $option->name,
                            'type' => [
                                'id' => $option->variationType->id,
                                'name' => $option->variationType->name,
                            ],
                        ];
                    }

                    $cartItemData[] = [
                        'id' => (string)$cartItem['id'],
                        'product_id' => $product->id,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'price' => $cartItem['price'],
                        'quantity' => $cartItem['quantity'],
                        'option_ids' => $cartItem['option_ids'],
                        'options' => $optionInfo,
                        'image' => $imageUrl ? : $product->getFirstMediaUrl('images', 'small'),
                        'user' => [
                            'id' => $product->created_by,
                            'name' => $product->user->vendor->store_name,
                        ],
                    ];
                }

                $this->cachedCartItems = $cartItemData;
            }
            return $this->cachedCartItems;
        }catch (\Exception $e){
            throw $e;
            Log::error($e->getMessage(). PHP_EOL.$e->getTraceAsString());
        }
        return [];
    }
    public function getTotalQuantity(): int
    {
        $totalQuantity = 0;
        foreach ($this->getCartItems() as $item) {
            $totalQuantity += $item['quantity'];
        }
        return $totalQuantity;
    }


    public function getTotalPrice(): float
    {
        $total = 0;
        foreach ($this->getCartItems() as $item) {
            $total += $item['quantity'] * $item['price'];
        }
        return $total;
    }
    protected function updateItemQuantityInDatabase(int $productId, int $quantity, array $optionIds ):void
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $quantity,
            ]);
        }

    }
    protected function updateItemQuantityInCookies(int $productId, int $quantity, array $optionIds ):void
    {
        $cartItems = $this->getCartItemsFromCookies();

        ksort($optionIds);
        $itemKey = $productId . '_' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] = $quantity;
        }
        // save cart item back to cookie
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }
    protected function saveItemToDatabase(int $productId, int $quantity, array $optionIds, $price):void
    {
        $userId = Auth::id();
        ksort($optionIds);

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();
        if ($cartItem) {
            $cartItem->update([
                'quantity' => DB::raw('quantity +' . $quantity),
            ]);
        } else {
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'variation_type_option_ids' => $optionIds,
            ]);
        }
    }
    protected function saveItemToCookies(int $productId, int $quantity, $price, array $optionIds):void
    {
        $cartItems = $this->getCartItemsFromCookies();

        ksort($optionIds);
        $itemKey = $productId . '_' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] += $quantity;
            $cartItems[$itemKey]['price'] = $price;
        } else {
            $cartItems[$itemKey] = [
                'id' => (string)Str::uuid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'option_ids' => $optionIds,
            ];
        }
        //save updated cart item in cookie
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);

    }
    protected function removeItemFromDatabase(int $productId, array $optionIds = null)
    {
        $userId = Auth::id();

        ksort($optionIds);

        CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->delete();
    }
    protected function removeItemFromCookies(int $productId, array $optionIds = null)
    {
        $cartItems = $this->getCartItemsFromCookies();

        // Sort options by key if provided
        if ($optionIds !== null) {
            ksort($optionIds);
        }

        // Create a unique cart key using productId and optionIds
        $cartKey = $productId . '_' . json_encode($optionIds);

        // Remove the item from the cart array
        unset($cartItems[$cartKey]);

        // Save the updated cart items back to the cookies
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function getCartItemsFromDatabase()
    {
        $userId = Auth::id();

        $cartItems = CartItem::where('user_id', $userId)
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'option_ids' => $cartItem->variation_type_option_ids,
                ];
            })
            ->toArray();
        return $cartItems;
    }
    protected function getCartItemsFromCookies()
    {
        $cartItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]'), true);

        return is_array($cartItems) ? $cartItems : [];
    }

    public function getCartItemsGrouped(): array
    {
        $cartItems = $this->getCartItems();

        return collect($cartItems)
            ->groupBy(fn ($item) => $item['user']['id'])
            ->map(fn ($items, $userId) => [
                'user' => $items->first()['user'],
                'items' => $items->toArray(),
                'totalQuantity' => $items->sum('quantity'),
                'totalPrice' => $items->sum(fn ($item) => $item['price'] * $item['quantity']),

            ])
            ->toArray();
    }
    public function moveCartItemsToDatabase($userId): void
    {
        $cartItems = $this->getCartItemsFromCookies();

        foreach ($cartItems as $itemKey => $cartItem) {
            // Check if the item already exists in the database
            $existingItem = CartItem::where('user_id', $userId)
                ->where('product_id', $cartItem['product_id'])
                ->where('variation_type_option_ids', json_encode($cartItem['option_ids']))
                ->first();

            // If the item already exists, skip moving it to the database
            if ($existingItem) {
                continue;  // Skip this iteration and move to the next cart item
            }

            // If the item does not exist, create a new cart item in the database
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $cartItem['product_id'],
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['price'],
                'variation_type_option_ids' => $cartItem['option_ids'],
            ]);
        }

        // Clear the cart items from the cookies after moving to the database
        Cookie::queue(self::COOKIE_NAME, '', -1);
    }


    /**
     * @return array|null
     */
    public function getCartItemsSelected(array $selectedIds)
    {
        $allItems = $this->getCartItems();
        return array_filter($allItems, function ($item) use ($selectedIds) {
            return in_array($item['id'], $selectedIds);
        });
    }
}
