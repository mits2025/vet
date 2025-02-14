import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import InputLabel from '@/Components/Core/InputLabel';
import TextInput from '@/Components/Core/TextInput';
import InputError from '@/Components/Core/InputError';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import PhoneInput from 'react-phone-number-input';
import {FaFacebook, FaInstagram, FaTrash, FaTwitter} from "react-icons/fa";


export default function VendorRequestForm({ vendor, className = '' }: { vendor?: any; className?: string }) {
    const sectionRef = useRef<HTMLElement | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        store_name: vendor?.store_name || '',
        address: vendor?.address || '',
        phone: vendor?.phone || '',
        email: vendor?.email || '',
        profile_image: vendor?.profile_image || '',
        description: vendor?.description || '',
        opening_hours: vendor?.opening_hours || [],
        social_media_links: vendor?.social_media_links || [],
    });

    const hasExistingRequest = !!vendor;
    const status = vendor?.status || 'pending';

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

    const addOpeningHour = () => {
        setData('opening_hours', [...data.opening_hours, { day: 'Monday', open: '', close: '' }]);
    };

    const removeOpeningHour = (index: number) => {
        const newHours = data.opening_hours.filter((_:any, i:any) => i !== index);
        setData('opening_hours', newHours);
    };

    const addSocialLink = () => {
        setData('social_media_links', [...data.social_media_links, '']);
    };

    const removeSocialLink = (index: number) => {
        const newLinks = data.social_media_links.filter((_:any, i:any) => i !== index);
        setData('social_media_links', newLinks);
    };
    const handleFileChange = (file: File | undefined) => {
        if (file) {
            setData("profile_image", file);
        }
    };

    const detectPlatform = (url: string): string => {
        if (url.includes("facebook.com")) return "facebook";
        if (url.includes("instagram.com")) return "instagram";
        if (url.includes("twitter.com")) return "twitter";
        return "unknown"; // Default if platform is not recognized
    };

    const handleSocialMediaChange = (index: number, newUrl: string) => {
        const newLinks = [...data.social_media_links];
        newLinks[index] = { platform: detectPlatform(newUrl), url: newUrl };
        setData("social_media_links", newLinks);
    };


    const openingHours = Array.isArray(data.opening_hours) ? data.opening_hours : [];
    const socialMediaLinks = Array.isArray(data.social_media_links) ? data.social_media_links : [];



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
                    <InputLabel htmlFor="address" value="Store Address" />
                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        disabled={hasExistingRequest}
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                {/* Existing contact fields */}
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
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                        disabled={hasExistingRequest}
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="profile_image" value="Profile Image" />
                    <input
                        type="file"
                        id="profile_image"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                        disabled={hasExistingRequest}
                        className="custom-phone-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    {/* ✅ Preserve Uploaded Image or Show Existing URL */}
                    {data.profile_image && (
                        <img
                            src={
                                typeof data.profile_image === "string"
                                    ? `/storage/${data.profile_image}` // Keep existing image on refresh
                                    : URL.createObjectURL(data.profile_image) // Show preview for newly uploaded image
                            }
                            alt="Profile Preview"
                            className="mt-2 w-32 h-32 rounded-full object-cover"
                        />
                    )}

                    <InputError className="mt-2" message={errors.profile_image} />
                </div>



                <div>
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        className="custom-phone-input wysiwyg-output mt-1 block w-full rounded-md border border-indigo-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        disabled={hasExistingRequest}
                        rows={4}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div>
                    <InputLabel value="Opening Hours" />

                    {openingHours.length > 0 ? (
                        openingHours.map((hour: any, index: number) => (
                            <div key={index} className="flex flex-wrap items-center gap-2 mt-2">
                                {/* Day Selection */}
                                <select
                                    value={hour.day}
                                    onChange={(e) => {
                                        const newHours = [...openingHours];
                                        newHours[index] = { ...newHours[index], day: e.target.value };
                                        setData('opening_hours', newHours);
                                    }}
                                    className=" rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 text-sm"
                                    disabled={hasExistingRequest}
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                        <option key={day} value={day}>
                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                {/* Time Inputs (Stacked) */}
                                <div className="flex flex-col w-full">
                                    <TextInput
                                        type="time"
                                        value={hour.open || ''}
                                        onChange={(e) => {
                                            const newHours = [...openingHours];
                                            newHours[index] = { ...newHours[index], open: e.target.value };
                                            setData('opening_hours', newHours);
                                        }}
                                        disabled={hasExistingRequest}
                                        className="w-24 p-1 text-sm border rounded-md shadow-sm"
                                        placeholder="Open"
                                    />

                                    <TextInput
                                        type="time"
                                        value={hour.close || ''}
                                        onChange={(e) => {
                                            const newHours = [...openingHours];
                                            newHours[index] = { ...newHours[index], close: e.target.value };
                                            setData('opening_hours', newHours);
                                        }}
                                        disabled={hasExistingRequest}
                                        className="w-24 p-1 text-sm border rounded-md shadow-sm mt-1"
                                        placeholder="Close"
                                    />
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeOpeningHour(index)}
                                    className="text-red-500 text-xs p-1 rounded-md hover:bg-red-100 transition disabled:opacity-50"
                                    disabled={hasExistingRequest}
                                >
                                    <FaTrash className="text-red-500 text-sm" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No opening hours added.</p>
                    )}

                    {/* Add Opening Hour Button */}
                    <button
                        type="button"
                        onClick={addOpeningHour}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                        disabled={hasExistingRequest}
                    >
                        Add Opening Hour
                    </button>
                </div>




                {/* Social Media Links Section */}
                <div>
                    <InputLabel value="Social Media Links" />
                    {socialMediaLinks.length > 0 ? (
                        socialMediaLinks.map((link, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={link.url}
                                    onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                                    disabled={hasExistingRequest}
                                    placeholder="https://example.com"
                                />
                                {link.platform === "facebook" && <FaFacebook className="text-blue-500" />}
                                {link.platform === "instagram" && <FaInstagram className="text-pink-500" />}
                                {link.platform === "twitter" && <FaTwitter className="text-blue-400" />}
                                <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500">
                                    <FaTrash className="text-red-500 cursor-pointer" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No social media links added.</p>
                    )}
                    <button type="button" onClick={addSocialLink} className="mt-2 text-sm text-indigo-600">
                        Add Social Media Link
                    </button>
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
