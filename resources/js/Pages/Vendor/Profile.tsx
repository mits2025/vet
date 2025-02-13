import React from 'react';
import { PageProps, Product, PaginationProps, Vendor } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ProductItem from "@/Components/App/ProductItem";

function Profile({ vendor, products }: PageProps<{ vendor: Vendor, products: PaginationProps<Product> }>) {
    return (
        <AuthenticatedLayout>
            <Head title={`${vendor?.store_name || ''} Profile Page`} />

            <div
                className="hero min-h-[320px]"
                style={{
                    backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)"
                }}
            >
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">
                            {vendor?.store_name || 'Vendor'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {products?.data?.length > 0 ? (
                        products.data.map(product => (
                            <ProductItem product={product} key={product.id} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No products available</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Profile;

