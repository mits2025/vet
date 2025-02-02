import {Product} from '@/types';
import {Link} from '@inertiajs/react';

export default function ProductItem({product}: {product: Product}) {

    return (
        <div className="prodlist card bg-white shadow-lg rounded-lg w-64 overflow-hidden">
            <Link href={route('product.show', product.slug)} className="block">
                <figure className="w-full aspect-square bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                </figure>
            </Link>
            <div className="p-3 space-y-2">
                <h2 className="text-sm font-semibold text-gray-800 truncate">
                    {product.title}
                </h2>
                <p className="text-xs text-gray-500">
                    by <Link href="/" className="text-blue-500 hover:underline">{product.user.name}</Link>&nbsp;
                    in <Link href="/" className="text-blue-500 hover:underline">{product.department.name}</Link>
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">{product.price}</span>
                    <button className="bg-black text-white text-xs px-3 py-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Add
                    </button>
                </div>
            </div>
        </div>

    )
}
