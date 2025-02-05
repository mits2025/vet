import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { CartItem as CartItemType } from "@/types";
import TextInput from "@/Components/Core/TextInput";
import { productRoute } from "@/helpers";

function CartItem({ item, isSelected, onToggle }: {
    item: CartItemType
    isSelected: boolean;
    onToggle: () => void;}) {
    const deleteForm = useForm({ option_ids: item.option_ids });
    const [error, setError] = useState("");

    const onDeleteClick = () => {
        deleteForm.delete(route("cart.destroy", item.product_id), { preserveScroll: true });
    };

    const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        router.put(
            route("cart.update", item.product_id),
            { quantity: ev.target.value, option_ids: item.option_ids },
            { preserveScroll: true, onError: (errors) => setError(Object.values(errors)[0]) }
        );
    };

    return (
        <div
            className={`grid grid-cols-5 gap-4 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-95 lg:m-5 cursor-pointer border-2
        ${isSelected
                ? 'border-primary bg-blue-50 dark:bg-blue-900 shadow-md'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'}
    `}
            onClick={onToggle}
        >

        {/* Product Image */}
            <Link
                href={productRoute(item)}
                className="mt-3 col-span-2 sm:col-span-1 relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
            </Link>

            {/* Product Info */}
            <div className="mt-4 col-span-3 sm:col-span-3 flex flex-col justify-between space-y-2">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors turnicate">
                        <Link href={productRoute(item)}>{item.title}</Link>
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                        {item.options.map((option) => (
                            <div key={option.id} className="flex gap-1">
                                <span className="font-medium">{option.type.name}:</span>
                                <span>{option.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="relative">
                        <TextInput
                            type="number"
                            min="1"
                            defaultValue={item.quantity}
                            onBlur={handleQuantityChange}
                            className={`w-12 h-8 px-3 py-1.5 text-center border-2 rounded-lg focus:border-blue-500 ${
                                error ? "border-red-500" : "border-gray-200"
                            }`}
                        />
                        {error && (
                            <p className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-5 sm:col-span-1 flex sm:flex-col items-center justify-end gap-2 sm:gap-3 lg:mr-9 lg:mb-5">
                <button
                    onClick={(e) => {e.stopPropagation();onDeleteClick()}}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="sm:sr-only">Remove</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-700 px-3 py-1.5 text-sm font-medium rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="sm:sr-only">Save</span>
                </button>
            </div>

            {/* Price */}
            <div className="col-span-5 sm:col-span-4 flex items-center justify-end -mt-6">
                <div className="p-2 text-lg font-bold text-gray-900">
                    ₱{(item.price * item.quantity).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
                </div>
            </div>
        </div>
    );
}

export default CartItem;
