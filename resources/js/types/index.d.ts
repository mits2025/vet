import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}
export type Image = {
    id: number;
    thumb: string;
    small: string;
    large: string;
}
export type VariationTypeOption = {
    id: number;
    name: string;
    images: Image[];
    type: VariationType
}
export type VariationType = {
    id: number;
    name: string;
    type: 'Select'|'Radio'|'Image';
    options: VariationTypeOption[]
}

export type Product = {
    id: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    images: Image[];
    short_description: string;
    description: string;
    user: {
        id: number;
        name: string;
        store_name: string;
    };
    department: {
        id: number;
        name: string;
    };
    variationTypes: VariationType[],
    variations: Array<{
        id: number;
        variation_type_option_ids: number[];
        quantity: number;
        price: number;
    }>
}
export type CartItem = {
    id: number;
    product_id: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    option_ids: Record<string, number>;
    options: VariationTypeOption[]
}

export type GroupedCartItems = {
    user: User;
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
}

export type PaginationProps<T> = {
    data: Array<T>
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    csrf_token: string;
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    totalQuantity: number;
    totalPrice: number;
    miniCartItems: CartItem[];
};

export type Vendor = {
    id: number;
    profile_image?: string | null; // Allow null in case the image isn't set
    store_name: string;
    address: string;
    phone: string;
    description: string;
    email: string;
    opening_hours: string | { day: string; open: string; close: string; }[]; // Allow both types
    social_media_links: { platform: string; url: string }[];
    store_address: string;
};

