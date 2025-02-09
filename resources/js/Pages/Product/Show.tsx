import {Product, VariationTypeOption} from '@/types';
import {useEffect, useMemo, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Carousel from "@/Components/Core/Carousel";
import {Head, router, useForm, usePage} from "@inertiajs/react";
import Select, { SingleValue } from 'react-select';
import {arraysAreEqual} from "@/helpers";


function Show({product, variationOptions} : {
    product: Product, variationOptions: number[]
}) {
        console.log(product, variationOptions);

    const form = useForm<{
        option_ids: Record<string, number>;
        quantity: number;
        price: number | null;
    }>({
        option_ids: {},
        quantity: 1,
        price: null
    })

    const {url} = usePage();

    const [selectedOptions, setSelectedOptions] =
        useState<Record<number, VariationTypeOption>>([]);

    const images = useMemo(() => {
        for (let typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images.length > 0) return option.images;
        }
        return product.images;
    }, [product, selectedOptions]);


    const computedProduct = useMemo(() => {
        const selectedOptionIds = Object.values(selectedOptions)
            .map((op) => op.id)
            .sort();

        if (!Array.isArray(product.variations)) {
            return {
                price: product.price,
                quantity: product.quantity,
            };
        }

        for (let variation of product.variations) {
            const optionIds = variation.variation_type_option_ids.sort();
            if (arraysAreEqual(selectedOptionIds, optionIds)) {
                return {
                    price: variation.price,
                    quantity:
                        variation.quantity == null
                            ? Number.MAX_VALUE
                            : variation.quantity,
                };
            }
        }
        return {
            price: product.price,
            quantity: product.quantity,
        };
    }, [product, selectedOptions]);


    useEffect(() => {
        for (let type of product.variationTypes) {
            const selectedOptionId: number = variationOptions[type.id];
            console.log(selectedOptionId, type.options)
            chooseOption(
                type.id,
                type.options.find(op => op.id ==
                selectedOptionId) || type.options[0],
                false
            )
        }
    }, []);
    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(
            Object.entries(newOptions).map(([a, b]) => [a, b.id])
        )

    }
    const chooseOption = (
        typeId: number,
        option: VariationTypeOption,
        updateRouter: boolean = true
    ) => {

     setSelectedOptions((prevSelectedOptions) => {
         const newOptions = {
             ...prevSelectedOptions,
             [typeId]: option
         }

         if (updateRouter) {
           router.get(url, {
               options: getOptionIdsMap(newOptions)
           }, {
               preserveScroll: true,
               preserveState: true
           })
         }
         return newOptions
     })
    }
    const onQuantityChange = (newValue: SingleValue<{ value: number; label: string }>) => {
        if (newValue) {
            form.setData('quantity', newValue.value);
        }
    }
    const [quantityError, setQuantityError] = useState('');

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                setQuantityError(errors.quantity || '');
            },
            onSuccess: () => {
                setQuantityError('');
            }
        });
    };
    const renderProductVariationTypes = () => {
        return (
            product.variationTypes.map((type, i) => (
                <div key={type.id}>
                    <b>{type.name}</b>
                    {type.type == 'Image' &&
                        <div className="flex gap-2 mb-4">
                            {type.options.map(option => (
                                <div onClick={() => chooseOption(type.id,option)} key={option.id}>
                                    {option.images && <img src={option.images[0].thumb}
                                                           alt="" className={'w-[60px] ' + (
                                        selectedOptions[type.id]?.id === option.id ?
                                            'border-2 hover:border-gray-800' : ''
                                    )}/>}
                                    <p className="text-xs text-gray-500 opacity-75  text-center">{option.name}</p>

                                </div>
                            ))}
                        </div>}
                    {type.type === 'Radio' &&
                        <div className="flex flex-wrap gap-1 mb-4">
                            {type.options.map(option => (
                                <label
                                    key={option.id}
                                    className={` btn ${
                                        selectedOptions[type.id]?.id === option.id ? 'bg-black text-white' : 'bg-gray-100 text-black'
                                    }`}
                                >
                                    <input
                                        onChange={() => chooseOption(type.id, option)}
                                        className="hidden"
                                        type="radio"
                                        value={option.id}
                                        checked={selectedOptions[type.id]?.id === option.id}
                                        name={'variation_type_' + type.id}
                                        aria-label={option.name}
                                    />
                                    {option.name}
                                </label>
                            ))}
                        </div>
                    }
                </div>
            ))
        )
    }
    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions).map(([typeId, option]: [string, VariationTypeOption]) => [typeId, option.id])
        );
        form.setData('option_ids', idsMap);
    }, [selectedOptions]);


    const renderAddToCartButton = () => {
        // Custom styles for react-select component
        const customStyles = {
            control: (provided: any) => ({
                ...provided,
                minHeight: '49px', // Reduce the height
                borderRadius: '4px',
                borderColor: '#D1D5DB', // Tailwind's 'border-gray-300'
                '&:hover': { borderColor: '#9CA3AF' }, // Tailwind's 'border-gray-400'
            }),
            option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isSelected ? 'darkblue' : 'white', // Tailwind's 'bg-green-600'
                color: state.isSelected ? 'white' : 'black',
                '&:hover': { backgroundColor: '#E5E7EB' }, // Tailwind's 'bg-gray-200'
            }),
        };

        const options = Array.from({ length: Math.min(computedProduct.quantity) }).map((_, i) => ({
            value: i + 1,
            label: `QTY: ${i + 1}`,
        }));

        const onQuantityChange = (newValue: SingleValue<{ value: number; label: string }>) => {
            form.setData('quantity', newValue ? newValue.value : 1);
        };

        return (
            <div className="mb-8 flex flex-col gap-4">
                <div className="flex gap-4">
                    <Select
                        onChange={onQuantityChange}
                        value={options.find(option => option.value === form.data.quantity) || null}
                        options={options}
                        styles={customStyles}
                        className="w-full"
                        placeholder="Select Quantity"
                    />
                    <button
                        onClick={addToCart}
                        className="btn text-white rounded-lg bg-primary hover:bg-black transition duration-300 flex items-center justify-center py-3 text-base"
                    >
                        Add to Cart
                    </button>
                </div>

                {/* Error message appears below */}
                {quantityError && (
                    <div className="text-red-500 text-sm">{quantityError}</div>
                )}
            </div>


        );
    };


    return (
        <AuthenticatedLayout>
            <Head title={product.title} />

            <div className="max-w-6xl mx-auto p-6 lg:p-12">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 items-start">

                    {/* Product Image Carousel */}
                    <div className="aside col-span-6 sticky top-6">
                        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-md">
                            <Carousel images={images} />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-span-6 space-y-6">
                        <h1 className="text-3xl font-extrabold text-gray-900">{product.title}</h1>

                        {/* Price Display */}
                        <div className="border-t pt-4 text-gray-900">
                            {(() => {
                                const formattedPrice = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(computedProduct.price);
                                const pesoSign = formattedPrice.charAt(0);
                                const priceNumber = formattedPrice.substring(1);

                                return (
                                    <div className="text-4xl font-semibold flex items-baseline">
                                        <span className="text-2xl">{pesoSign}</span>
                                        {priceNumber}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Variations */}
                        {renderProductVariationTypes()}

                        {/* Stock Status */}
                        {computedProduct.quantity !== undefined && (
                            <div className="my-4 text-lg font-medium">
                                {computedProduct.quantity === 0 ? (
                                    <span className="text-red-700 px-4 py-2 rounded-md">
                                Out of Stock
                            </span>
                                ) : computedProduct.quantity < 20 ? (
                                    <span className="text-yellow-700 px-4 py-2 rounded-md">
                                Only {computedProduct.quantity} left!
                            </span>
                                ) : (
                                    <span className="text-green-600">In Stock</span>
                                )}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        {renderAddToCartButton()}

                        {/* About the Item */}
                        <div className="pt-6 border-t border-gray-300">
                            <b className="text-xl text-gray-800">About The Item</b>
                            <div
                                className="wysiwyg-output text-gray-700 leading-relaxed mt-2"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}

export default Show;
