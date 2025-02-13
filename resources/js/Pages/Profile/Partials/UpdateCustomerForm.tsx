import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import {useForm} from '@inertiajs/react';
import { FormEventHandler } from 'react';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useEffect, useState } from 'react';
import cebuAddresses from '@/Data/cebu-addresses.json';
import Select from "react-select";  // Correctly imported JSON


export default function UpdateCustomerForm({ customer, className = '' }: { customer?: any; className?: string }) {
    const [municipalities, setMunicipalities] = useState<string[]>([]);
    const [barangays, setBarangays] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        state: 'Cebu', // Fixed value
        street: customer?.street || '',
        municipality: customer?.municipality || '',
        barangays: customer?.barangays || '',
        postal_code: customer?.postal_code || '',
        country: 'Philippines', // Fixed value
    });

    useEffect(() => {
        // Load municipalities
        const cebuMunicipalities = Object.keys(cebuAddresses.Cebu.municipalities);
        setMunicipalities(cebuMunicipalities);

        // Set initial barangays if editing
        if (customer?.municipality) {
            const initialBarangays = Object.keys(
                cebuAddresses.Cebu.municipalities[customer.municipality].barangays
            );
            setBarangays(initialBarangays);
        }
    }, []);

    const municipalityOptions = municipalities.map((municipality) => ({
        value: municipality,
        label: municipality,
    }));

    const handleMunicipalityChange = (selectedOption: { value: string; label: string } | null) => {
        const selectedMunicipality = selectedOption ? selectedOption.value : "";

        setData("municipality", selectedMunicipality);

        // Reset barangay and postal code when municipality changes
        setData("barangays", "");
        setData("postal_code", "");

        if (selectedMunicipality) {
            // Load barangays for the selected municipality
            const municipalityData = cebuAddresses.Cebu.municipalities[selectedMunicipality];
            setBarangays(Object.keys(municipalityData.barangays));
        } else {
            setBarangays([]); // Reset barangays if no municipality is selected
        }
    };

    const barangayOptions = barangays.map((barangay) => ({
        value: barangay,
        label: barangay,
    }));

    const handleBarangayChange = (selectedOption: { value: string; label: string } | null) => {
        const selectedBarangay = selectedOption ? selectedOption.value : "";

        setData("barangays", selectedBarangay);

        // Set postal code automatically
        if (selectedBarangay && data.municipality) {
            const postalCode = cebuAddresses.Cebu.municipalities[data.municipality].barangays[selectedBarangay];
            setData("postal_code", postalCode);
        } else {
            setData("postal_code", "");
        }
    };

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
                        type="string"
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

                {/* State Field */}
                <div>
                    <InputLabel htmlFor="state" value="State/Province" />
                    <TextInput
                        id="state"
                        className="mt-1 block w-full"
                        value="Cebu"
                        readOnly
                        onChange={(e) => setData('state', 'Cebu')}
                    />
                    <InputError className="mt-2" message={errors.state} />
                </div>

                {/* Street Field */}
                <div>
                    <InputLabel htmlFor="street" value="Street" />
                    <TextInput
                        id="street"
                        className="custom-phone-input mt-1 block"
                        value={data.street}
                        onChange={(e) => setData('street', e.target.value)}
                        required
                        autoComplete="street"
                    />
                    <InputError className="mt-2" message={errors.street} />
                </div>

                {/* Municipality Field */}
                <div>
                    <InputLabel htmlFor="municipality" value="Municipality/City" />
                    <Select
                        id="municipality"
                        className="custom-phone-input w-full"
                        classNamePrefix="react-select"
                        options={municipalityOptions}
                        value={municipalityOptions.find((option) => option.value === data.municipality) || null}
                        onChange={handleMunicipalityChange}  // ✅ Fixed onChange function
                        placeholder="Select Municipality/City"
                        isClearable
                        isSearchable
                    />
                    <InputError className="mt-2" message={errors.municipality} />
                </div>

                {/* Barangays Field */}
                <div>
                    <InputLabel htmlFor="barangays" value="Barangay" />
                    <Select
                        id="barangays"
                        className="custom-phone-input w-full"
                        classNamePrefix="react-select"
                        options={barangayOptions}
                        value={barangayOptions.find((option) => option.value === data.barangays) || null}
                        onChange={handleBarangayChange} // ✅ React-friendly event handler
                        placeholder="Select Barangay"
                        isClearable
                        isSearchable
                        isDisabled={!barangays.length} // Disable if no barangays available
                    />
                    <InputError className="mt-2" message={errors.barangays} />
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
