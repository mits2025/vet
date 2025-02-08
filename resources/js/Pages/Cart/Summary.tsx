import React, { useState, useMemo } from 'react';
import { PageProps, GroupedCartItems } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {CreditCardIcon, ShoppingCartIcon} from "@heroicons/react/16/solid";
import { ShoppingBagIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import SummaryOrders from "@/Components/App/SummaryOrders";

function Summary({
                   csrf_token,
                   cartItems,
                   totalQuantity,
                   totalPrice
               }: PageProps<{ cartItems: Record<number, GroupedCartItems> }>) {
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    return (
        <AuthenticatedLayout>
            <Head title="Your Cart" />
            <div className="container mx-auto">
                <div className="p-4 lg:p-8 flex flex-col gap-6 lg:mr-9 lg:ml-9">
                    {/* Checkout Summary - Top on mobile, Sticky sidebar on desktop */}


                    {/* Main Content Area */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items Section - Now takes priority in layout */}
                        <div className="flex-1 h-screen ">
                            <div className="card bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-md rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <ShoppingBagIcon className="w-6 h-6 mb-6" />
                                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                                        ORDER SUMMARY
                                    </h2>
                                </div>
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
                                                </div>

                                                {/* Cart Items */}
                                                <div className="space-y-4">
                                                    {cartItem.items.map((item) => (
                                                        <SummaryOrders
                                                            item={item}
                                                            key={item.id}
                                                            isSelected={true}
                                                            onToggle={() => {}}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Summary;
