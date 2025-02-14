import { Product } from '@/types';
import { Link, useForm } from '@inertiajs/react';

export default function ProductItem({ product }: { product: Product }) {
    const form = useForm<{ option_ids: Record<string, number>; quantity: number }>({
        option_ids: {},
        quantity: 1,
    });

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err);
            },
        });
    };

    return (
        <div className="card bg-white shadow-md md:shadow-lg rounded-lg w-full overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <Link href={route('product.show', product.slug)} className="block">
                <figure className="w-full aspect-square bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                </figure>
            <div className="p-2 md:p-3 space-y-1 md:space-y-2">
                <h2 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                    {product.title}
                </h2>
                <p className="text-[10px] md:text-xs text-gray-500">
                    by <Link href={route('vendor.profile', product.user.store_name)} className="text-blue-500 hover:underline">{product.user.store_name}</Link>&nbsp;
                    in <Link href="/" className="text-blue-500 hover:underline">{product.department.name}</Link>
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-bold text-gray-800">{product.price}</span>
                </div>
            </div>
            </Link>
        </div>
    );
}
