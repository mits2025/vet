import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import InputLabel from '@/Components/Core/InputLabel';
import TextInput from '@/Components/Core/TextInput';
import InputError from '@/Components/Core/InputError';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import PhoneInput from 'react-phone-number-input';

export default function VendorRequestForm({ vendor, className = '' }: { vendor?: any; className?: string }) {
    const sectionRef = useRef<HTMLElement | null>(null); // For auto-scroll

    const { data, setData, post, processing, errors } = useForm({
        store_name: vendor?.store_name || '',
        store_address: vendor?.store_address || '',
        phone: vendor?.phone || '',
        email: vendor?.email || '',
    });

    const hasExistingRequest = !!vendor;
    const status = vendor?.status || 'pending'; // Default to 'pending'

    // Define status colors based on VendorStatusEnum
    const statusColors: Record<string, string> = {
        pending: 'bg-gray-200 text-gray-800',
        approved: 'bg-green-200 text-green-800',
        rejected: 'bg-red-200 text-red-800',
    };

    useEffect(() => {
        if (vendor && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [vendor]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasExistingRequest) {
            post(route('vendor.request'), {
                onSuccess: () => {
                    if (sectionRef.current) {
                        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                },
            });
        }
    };

    return (
        <section ref={sectionRef} className={className}>
            {/* Vendor Status Display */}
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>

            <header className="mt-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Become a Vendor
                </h2>
                <p className="custom-phone-input mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md">
                    {hasExistingRequest ? (
                        status === 'approved' ? (
                            <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Your store is ready! Make your products stand out.</span>
            </span>
                        ) : status === 'rejected' ? (
                            <span className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Unfortunately, you didn’t qualify for our vendor program. Please review the requirements and try again.</span>
            </span>
                        ) : (
                            <span className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12c0 4.5-3.5 8-8 8H11c-4.5 0-8-3.5-8-8s3.5-8 8-8h2c4.5 0 8 3.5 8 8z" />
                </svg>
                <span>Your vendor request has been submitted and will be processed for assessment . Please Check your Email timely.</span>
            </span>
                        )
                    ) : (
                        'Fill in your store details to request vendor approval.'
                    )}
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
                        disabled={hasExistingRequest}
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
                        disabled={hasExistingRequest}
                    />
                    <InputError className="mt-2" message={errors.store_address} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <PhoneInput
                        id="phone"
                        defaultCountry="PH"
                        value={data.phone}
                        onChange={(value) => setData('phone', value ?? '')}
                        required
                        className="custom-phone-input mt-1 block w-full"
                        disabled={hasExistingRequest}
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="string"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    {!hasExistingRequest ? (
                        <PrimaryButton className="bg-indigo-600" disabled={processing}>
                            Submit Request
                        </PrimaryButton>
                    ) : (
                        <p className="text-sm text-gray-500">
                            You have already submitted a request.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
