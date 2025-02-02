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
            <div className="hero full-width bg-gray-200 min-h-[250px] w-full">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello there</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn bg-black text-white hover:bg-gray-800">Get Started</button>
                    </div>
                </div>
            </div>
            <div className="list">
                {products.data.map((product) => (
                    <ProductItem product={product} key={product.id} />
                ))}
            </div>



        </AuthenticatedLayout>
    );
}
