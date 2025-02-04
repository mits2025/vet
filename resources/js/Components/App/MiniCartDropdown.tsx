import React, { useState } from 'react';
import { Link, usePage } from "@inertiajs/react";
import {productRoute} from "@/helpers";
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

function MiniCartDropdown() {
    const { totalQuantity, totalPrice, miniCartItems} = usePage().props;

    // State to manage visibility of the dropdown
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible((prevState) => !prevState);
    };

    return (
        <div className="dropdown dropdown-end">
            {/* Cart Icon */}
            <div
                tabIndex={0}
                role="button"
                className="group p-2 hover:bg-gray-100/80 transition-all duration-200 ease-out rounded-full relative"
                onClick={toggleDropdown}
            >
                <div className="indicator mt-3">
                    <ShoppingCartIcon
                        className="h-6 w-6 text-gray-700 group-hover:text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    />
                    <span className="absolute -top-4 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {totalQuantity}
            </span>
                </div>
            </div>

            {/* Dropdown Content */}
            {isDropdownVisible && (
                <div
                    tabIndex={0}
                    className="dropdown-content shadow-2xl bg-white/95 backdrop-blur-sm z-50 mt-3 w-80 md:w-96 origin-top-right md:-mr-2 animate-slide-in"
                >
                    <div className="p-4 md:p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Your Cart</h3>
                            <span className="text-sm text-gray-500">{totalQuantity} items</span>
                        </div>

                        {/* Items List */}
                        <div className="divide-y divide-gray-100 max-h-64 md:max-h-96 overflow-y-auto">
                            {miniCartItems.length === 0 ? (
                                <div className="py-6 text-center text-gray-400">
                                    Your cart is empty
                                </div>
                            ) : (
                                miniCartItems.map((item) => (
                                    <Link
                                        href={productRoute(item)}
                                        key={item.id}
                                        className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-gray-50/80 transition-colors duration-150"
                                    >
                                        {/* Product Image */}
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm md:text-base font-medium text-gray-900 truncate">
                                                {item.title}
                                            </h4>
                                            <div className="text-xs md:text-sm text-gray-500 mt-1">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-sm md:text-base font-semibold text-gray-900">
                                            ₱{(item.price * item.quantity).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-sm md:text-base text-gray-600">Subtotal:</span>
                                <span className="text-base md:text-lg font-bold text-gray-900">
                            ₱{totalPrice.toLocaleString('en-PH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                            </div>

                            <Link
                                href={route('cart.index')}
                                className="block w-full text-center px-4 py-2 md:px-6 md:py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                View Cart & Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MiniCartDropdown;
