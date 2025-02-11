<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

// ========================
// Guest Routes
// ========================
Route::get('/', [ProductController::class, 'home'])->name('dashboard');
Route::get('/product/{product:slug}', [ProductController::class, 'show'])->name('product.show');

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

    // User Becoming a Vendor Request
    Route::post('/vendor/request', [VendorController::class, 'requestVendor'])
        ->name('vendor.request')
        ->middleware('auth');

    // Verified Routes
    Route::middleware(['verified'])->group(function () {
        Route::match(['get', 'post'], '/cart/summary', [CartController::class, 'summary'])->name('cart.summary');
    });
});

require __DIR__.'/auth.php';
