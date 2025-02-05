import {PageProps, PaginationProps, Product} from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductItem from "@/Components/App/ProductItem";

export default function Home({
    products
}: PageProps<{ products: PaginationProps<Product> }>) {

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Discover Your Next Favorite Product
                        </h1>
                        <p className="text-sm md:text-xl text-gray-300 mb-6 md:mb-8">
                            Explore our curated collection of premium items. Find exactly what you need with our hand-picked selection of quality products.
                        </p>
                        <button className="btn btn-primary px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg font-semibold rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            Start Exploring
                        </button>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <main className="container px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {products.data.map((product) => (
                        <ProductItem
                            product={product}
                            key={product.id}

                        />
                    ))}
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
