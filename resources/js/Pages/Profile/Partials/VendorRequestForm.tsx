import { router, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/Core/InputLabel';
import TextInput from '@/Components/Core/TextInput';
import InputError from '@/Components/Core/InputError';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import PhoneInput from 'react-phone-number-input';

interface FormData {
    store_name: string;
    store_address: string;
    phone: string;
    [key: string]: string;  // Add index signature
}

export default function VendorRequestForm({ className = '' }) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        store_name: '',
        store_address: '',
        phone: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.request')); // This sends data to Laravel
    };


    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Become a Vendor
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Fill in your store details to request vendor approval.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="store_name" value="Store Name" />
                    <TextInput
                        id="store_name"
                        className="mt-1 block w-full"
                        value={data.store_name}
                        onChange={(e) => setData('store_name', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.store_name} />
                </div>

                <div>
                    <InputLabel htmlFor="store_address" value="Store Address" />
                    <TextInput
                        id="store_address"
                        className="mt-1 block w-full"
                        value={data.store_address}
                        onChange={(e) => setData('store_address', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.store_address} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <PhoneInput
                        id="phone"
                        defaultCountry="PH" // Set default country to Philippines
                        value={data.phone}
                        onChange={(value) => setData('phone', value ?? '')} // ✅ Ensure value is always a string
                        required
                        className="custom-phone-input mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton className="bg-indigo-600" disabled={processing}>
                        Submit Request
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}

