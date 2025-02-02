import React, { useState } from 'react';
import { Link, usePage } from "@inertiajs/react";

function MiniCartDropdown() {
    const { totalQuantity, totalPrice, cartItems } = usePage().props;

    // State to manage visibility of the dropdown
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible((prevState) => !prevState);
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle hover:bg-gray-200 transition-all duration-200 ease-in-out rounded-full"
                onClick={toggleDropdown}
            >
                <div className="indicator">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="badge badge-sm indicator-item">{totalQuantity}</span>
                </div>
            </div>

            {/* Conditionally render the dropdown content based on state */}
            {isDropdownVisible && (
                <div
                    tabIndex={0}
                    className="minidrop card card-compact dropdown-content bg-white bg-opacity-95 z-[1] mt-3 w-[400px] shadow-xl rounded-lg transition-transform transform duration-200 ease-in-out"
                >
                    <div className="card-body p-4">
                        <span className="text-lg font-bold text-gray-800">
                            {totalQuantity} Items in Cart
                        </span>

                        <div className={'my-2 max-h-[300px] overflow-y-auto'}>
                            {cartItems.length === 0 ? (
                                <div className={'py-2 text-gray-500 text-center'}>
                                    No Items in Cart.
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <Link
                                        href={route('product.show', item.slug)}
                                        key={item.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                    >
                                        {/* Product Image (Smaller) */}
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Title & Quantity (More Compact) */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-700 truncate leading-tight">
                                                <Link
                                                    href={route('product.show', item.slug)}
                                                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                            </h3>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>

                                        {/* Price (Smaller & Right-Aligned) */}
                                        <div className="text-sm font-semibold text-gray-900 text-right">
                                            ₱{(item.price * item.quantity).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        <span className="text-lg font-bold text-green-600 mt-2 block">
                            Subtotal: ₱{totalPrice.toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                        </span>

                        <div className="card-actions mt-3">
                            <Link
                                href={route('cart.index')}
                                className="w-full inline-flex items-center justify-center rounded-md bg-black text-white py-2 text-sm font-semibold uppercase tracking-widest shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                View cart
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MiniCartDropdown;
