import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { CartItem as CartItemType } from "@/types";
import TextInput from "@/Components/Core/TextInput";
import { productRoute } from "@/helpers";

function CartItem({ item, isSelected, onToggle, readonly = false }: {
    item: CartItemType
    isSelected: boolean;
    onToggle?: () => void;
    readonly?: boolean;}) {
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
            onClick={!readonly ? onToggle: undefined}
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
                        {item.title}
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
                       <span>{item.quantity}</span>
                        {error && (
                            <p className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</p>
                        )}
                    </div>
                </div>
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
