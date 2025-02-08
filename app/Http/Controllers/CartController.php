<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService)
    {
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartService->getCartItemsGrouped(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product, CartService $cartService)
    {
        $request->MergeIfMissing([
            'quantity' => 1
        ]);

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $cartService->addItemToCart(
            $product,
            $data['quantity'],
            $data['option_ids'] ?: []
        );

        return back()->with('success', 'Product added to cart successfully!');
    }


    public function update(Request $request, Product $product, CartService $cartService)
    {
        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);
        $optionIds = $request->input('option_ids') ?: [];
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

        return back()->with('success', 'Product updated successfully!');

    }
    public function destroy(Request $request, Product $product, CartService $cartService)
    {
        $optionIds = $request->input('option_ids');

        $cartService->removeItemFromCart($product->id, $optionIds);

        return back()->with('success', 'Product removed from cart!');
    }

    public function summary(Request $request, CartService $cartService)
    {
        if ($request->isMethod('post')) {
            $selectedIds = explode(',', $request->input('selected_ids', ''));
            $selectedItems = $cartService->getCartItemsSelected($selectedIds);
            $request->session()->put('cart_summary', $selectedItems);
            return redirect()->route('cart.summary');
        }

        $selectedItems = $request->session()->get('cart_summary', []);
        $groupedItems = $this->groupSelectedItems($selectedItems);
        $overallTotalPrice = array_sum(array_column($groupedItems, 'totalPrice'));
        dd($selectedItems, $groupedItems, $overallTotalPrice);

        return Inertia::render('Cart/Summary', [
            'cartItems' => $groupedItems,
        ]);
    }

    private function groupSelectedItems(array $items): array
    {
        return collect($items)
            ->groupBy('user.id')
            ->map(function ($items, $userId) {
                $user = $items->first()['user'];
                return [
                    'user' => $user,
                    'items' => $items->toArray(),
                    'totalQuantity' => $items->sum('quantity'),
                    'totalPrice' => $items->sum(fn ($item) => $item['price'] * $item['quantity']),
                ];

            })
            ->toArray();
    }


    public function checkout()
    {

    }
}
