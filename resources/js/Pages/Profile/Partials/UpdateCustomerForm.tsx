import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import {useForm} from '@inertiajs/react';
import { FormEventHandler } from 'react';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
export default function UpdateCustomerForm({ customer, className = '' }: { customer?: any; className?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        street: customer?.street || '',
        city: customer?.city || '',
        state: customer?.state || '',
        postal_code: customer?.postal_code || '',
        country: customer?.country || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/customer/update');

    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Shipping Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's shipping information to proceed with checkout.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name Field */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Phone Field */}
                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <PhoneInput
                        id="phone"
                        defaultCountry="PH" // Set default country to Philippines
                        value={data.phone}
                        onChange={(value) => setData('phone', value)}
                        required
                        className="custom-phone-input mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                {/* Street Field */}
                <div>
                    <InputLabel htmlFor="street" value="Street" />
                    <TextInput
                        id="street"
                        className="mt-1 block w-full"
                        value={data.street}
                        onChange={(e) => setData('street', e.target.value)}
                        required
                        autoComplete="street"
                    />
                    <InputError className="mt-2" message={errors.street} />
                </div>

                {/* City Field */}
                <div>
                    <InputLabel htmlFor="city" value="City" />
                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.city} />
                </div>

                {/* State Field */}
                <div>
                    <InputLabel htmlFor="state" value="State/Province" />
                    <TextInput
                        id="state"
                        className="mt-1 block w-full"
                        value={data.state}
                        onChange={(e) => setData('state', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.state} />
                </div>

                {/* Postal Code Field */}
                <div>
                    <InputLabel htmlFor="postal_code" value="Postal Code/Zip Code" />
                    <TextInput
                        id="postal_code"
                        className="mt-1 block w-full"
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.postal_code} />
                </div>

                {/* Country Field */}
                <div>
                    <InputLabel htmlFor="country" value="Country" />
                    <TextInput
                        id="country"
                        className="mt-1 block w-full"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.country} />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Shipping Info'}
                    </PrimaryButton>

                </div>
            </form>
        </section>
    );
}
