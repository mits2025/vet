<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorStoryController;
use Illuminate\Support\Facades\Route;

// ========================
// Guest Routes
// ========================
Route::get('/', [ProductController::class, 'home'])->name('dashboard');
Route::get('/product/{product:slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('/s/{vendor:store_name}', [VendorController::class, 'profile'])->name('vendor.profile');

// ========================
// Cart Routes
// ========================
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart/add/{product}', 'store')->name('cart.store');
    Route::put('/cart/{product}', 'update')->name('cart.update');
    Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');
});

// ========================
// Authenticated Routes
// ========================
Route::middleware('auth')->group(function () {

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Customer (Shipping Information) Update
    Route::post('/customer/update', [CustomerController::class, 'update'])->name('customer.update');

    // User Becoming a Vendor
    Route::post('/vendor/request', [VendorController::class, 'requestVendor'])->name('vendor.request');

    // Vendor Stories
    Route::controller(VendorStoryController::class)->group(function () {
        Route::get('/vendor-stories/{vendorId}', 'index');
        Route::post('/vendor-stories', 'store');
        Route::post('/web/vendor-stories/upload', 'upload');
    });

    // Verified Routes
    Route::middleware(['verified'])->group(function () {Route::match(['get', 'post'], '/cart/summary', [CartController::class, 'summary'])->name('cart.summary');
    });
});


require __DIR__.'/auth.php';
