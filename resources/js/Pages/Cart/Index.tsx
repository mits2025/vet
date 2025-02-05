import React from 'react';
import { PageProps, GroupedCartItems } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/Core/PrimaryButton";
import {CreditCardIcon, ShoppingCartIcon} from "@heroicons/react/16/solid";
import CartItem from "@/Components/App/CartItem";
import {LockClosedIcon, UserCircleIcon} from "@heroicons/react/24/solid";

function Index({
                   csrf_token,
                   cartItems,
                   totalQuantity,
                   totalPrice
               }: PageProps<{ cartItems: Record<number, GroupedCartItems> }>) {
    return (
        <AuthenticatedLayout>
            <Head title="Your Cart" />
            <div className="container mx-auto">
            <div className="p-4 lg:p-8 flex flex-col gap-6 lg:mr-9 lg:ml-9">
                {/* Checkout Summary - Top on mobile, Sticky sidebar on desktop */}
                <div className="lg:hidden card bg-white dark:bg-gray-800 w-full p-6 shadow-md rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <span className="text-gray-600 dark:text-gray-300">Subtotal ({totalQuantity} items)</span>
                    </div>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span className="text-gray-600 dark:text-gray-300">Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estimated Tax</span>
                            <span className="text-gray-600 dark:text-gray-300">₱0.00</span>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-primary mb-4">
                        ₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <form action={route('cart.checkout')} method="post">
                        <input type="hidden" name="_token" value={csrf_token} />
                        <PrimaryButton className="w-full rounded-lg bg-primary hover:bg-primary-dark transition duration-300 flex items-center justify-center py-3 text-sm">
                            <CreditCardIcon className="w-5 h-5 mr-2" />
                            Checkout All Now
                        </PrimaryButton>
                    </form>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items Section - Now takes priority in layout */}
                    <div className="flex-1 h-screen ">
                        <div className="card bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-md rounded-lg border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                                Your Cart Items
                            </h2>
                            <div className="space-y-6">
                                {Object.keys(cartItems).length === 0 ? (
                                    <div className="py-8 text-center text-gray-500 dark:text-gray-300">
                                        <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-lg">Your cart is empty</p>
                                        <p className="text-sm mt-2 text-gray-400">
                                            Start adding items to see them here
                                        </p>
                                    </div>
                                ) : (
                                    Object.values(cartItems).map((cartItem) => (
                                        <div key={cartItem.user.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            {/* Seller Header */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <UserCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                                    <Link href={`/vendors/${cartItem.user.id}`} className="font-medium text-primary hover:text-primary-dark transition-colors">
                                                        {cartItem.user.name}
                                                    </Link>
                                                </div>
                                                <form action={route('cart.checkout')} method="post" className="w-full sm:w-auto">
                                                    <input type="hidden" name="_token" value={csrf_token} />
                                                    <input type="hidden" name="vendor_id" value={cartItem.user.id} />
                                                    <button className="w-full sm:w-auto bg-gray-300 btn btn-outline-primary text-sm py-1.5 px-4 flex items-center justify-center gap-2">
                                                        <CreditCardIcon className="w-4 h-4" />
                                                        <span>Checkout For This Seller</span>
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Cart Items */}
                                            <div className="space-y-4">
                                                {cartItem.items.map((item) => (
                                                    <CartItem item={item} key={item.id} />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Checkout Summary - Desktop Version */}
                    <div className="flex flex-col">
                    <div className="aside hidden lg:block w-full lg:w-96 pb-20 self-start">
                        <div className="card bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700 ">
                            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600 dark:text-gray-300">Subtotal ({totalQuantity} items)</span>
                                <span className="text-lg font-bold text-primary">
                            ₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </span>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-600 dark:text-gray-300">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Estimated Tax</span>
                                    <span className="text-gray-600 dark:text-gray-300">₱0.00</span>
                                </div>
                            </div>
                            <form action={route('cart.checkout')} method="post">
                                <input type="hidden" name="_token" value={csrf_token} />
                                <PrimaryButton className="w-full rounded-lg bg-primary hover:bg-primary-dark transition duration-300 flex items-center justify-center py-3 text-base">
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Secure All Checkout
                                </PrimaryButton>
                            </form>
                            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                <LockClosedIcon className="w-4 h-4 inline-block mr-1" />
                                Secure SSL Encryption
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
