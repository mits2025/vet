import React, {useState, useEffect} from 'react';
import { PageProps, Product, PaginationProps, Vendor } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ProductItem from "@/Components/App/ProductItem";
import StoryCarousel from "@/Components/Core/StoryCarousel";
import { usePage } from "@inertiajs/react";
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaCopy,
    FaCalendarAlt,
    FaClock,
    FaCheck,
    FaMap,
    FaBox,
    FaShoppingBag,
    FaStar
} from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import UploadStoryModal from "@/Components/Core/UploadStoryModal";

interface ProfileProps {
    vendorId: number;
    isOwner: boolean;
    vendorName: string;
    vendorImage: string;
}

function Profile({ vendor, products }: PageProps<{ vendor: Vendor, products: PaginationProps<Product> }>) {
    const openingHours = typeof vendor.opening_hours === "string"
        ? JSON.parse(vendor.opening_hours)
        : vendor.opening_hours;

    const { auth } = usePage().props as {
        auth: {
            user: { id: number } | null
        } | null
    };

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [refreshStories, setRefreshStories] = useState(false);
    const [showStoryCarousel, setShowStoryCarousel] = useState(false);
    const [hasStories, setHasStories] = useState(false);

    useEffect(() => {
        // Fetch stories using existing web route
        const checkStories = async () => {
            try {
                const response = await fetch(`/vendor-stories/${vendor.user_id}`);
                const data = await response.json();
                setHasStories(Array.isArray(data) && data.length > 0);
            } catch (error) {
                console.error('Error fetching stories:', error);
                setHasStories(false);
            }
        };

        checkStories();
    }, [vendor.user_id]);

    const handleUploadSuccess = () => {
        setRefreshStories((prev) => !prev);
        setShowUploadModal(false);
    };

    const socialMediaLinks = Array.isArray(vendor.social_media_links)
        ? vendor.social_media_links // Use it directly if it's already an array
        : typeof vendor.social_media_links === "string"
            ? JSON.parse(vendor.social_media_links)
            : [];

    const parsedLinks = (() => {
        try {
            return Array.isArray(socialMediaLinks)
                ? socialMediaLinks.filter(link => link && link.url) // Ensure it's an array and remove null/invalid values
                : [];
        } catch (error) {
            console.error('Error parsing social media links:', error);
            return [];
        }
    })();
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Address copied to clipboard!"); // You can replace this with a toast notification
        }).catch(err => console.error("Failed to copy: ", err));
    };
    const checkIfOpen = (hours: { open: string; close: string }) => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Convert opening and closing times to comparable numbers (HHMM)
        const [openHour, openMinute] = hours.open.split(":").map(Number);
        const [closeHour, closeMinute] = hours.close.split(":").map(Number);

        const openTime = openHour * 100 + openMinute;
        const closeTime = closeHour * 100 + closeMinute;
        const currentTime = currentHour * 100 + currentMinute;

        return currentTime >= openTime && currentTime < closeTime;
    };

    /*need for commit*/
    return (
        <AuthenticatedLayout>
            <Head title={`${vendor?.store_name || 'Vendor'} Profile`}/>

            {/* Hero Section - Fixed profile image positioning */}
            <div
                className="relative bg-base-200 w-full h-64 sm:h-72 md:h-[450px] flex items-center"
                style={{
                    backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 pt-8 sm:pt-12 md:pt-0">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="w-full flex justify-center md:w-auto">
                            <div className="relative group">
                                <div
                                    className={`relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 cursor-pointer
                                        ${hasStories ?
                                        'border-4 border-indigo-500 ring-4 ring-indigo-500/30' :
                                        'border-4 border-white'}
                                        rounded-full transition-all duration-300`}
                                    onClick={() => setShowStoryCarousel(true)}
                                >
                                    <img
                                        src={`/storage/${vendor.profile_image}`}
                                        className="w-full h-full rounded-full object-cover shadow-lg"
                                        alt={vendor.store_name}
                                    />
                                </div>

                                {auth?.user?.id === vendor.user_id && (
                                    <button
                                        className="absolute left-1/2 -translate-x-1/2 -bottom-4
                                        text-xs md:text-sm btn btn-primary btn-sm md:btn-md
                                        backdrop-blur-md bg-primary/90 hover:bg-primary
                                        rounded-full transition-all duration-300 flex gap-2"
                                        onClick={() => setShowUploadModal(true)}
                                    >
                                        Add Story
                                    </button>
                                )}


                            </div>
                        </div>

                        {showStoryCarousel && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
                                <div className="w-full max-w-sm mx-auto relative">
                                    <button
                                        onClick={() => setShowStoryCarousel(false)}
                                        className="absolute -top-10 right-0 text-white hover:text-primary transition-colors duration-300"
                                    >
                                        Close
                                    </button>
                                    <div className="bg-base-100 rounded-xl overflow-hidden shadow-2xl">
                                        <StoryCarousel
                                            vendorId={vendor.user_id}
                                            isOwner={auth?.user?.id === vendor.user_id}
                                            key={refreshStories.toString()}
                                            onClose={() => setShowStoryCarousel(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {showUploadModal && auth?.user?.id === vendor.user_id && (
                            <UploadStoryModal
                                vendorId={vendor.user_id}
                                onClose={() => setShowUploadModal(false)}
                                onUploadSuccess={handleUploadSuccess}
                            />
                        )}

                        <div className="flex-1 text-white text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3 line-clamp-2 flex items-center gap-2">
                                {vendor.store_name}

                                {vendor.status === "approved" && (
                                    <span className="badge badge-primary flex items-center gap-1 text-[10px] sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1">
                                        <FaCheck className="text-[5px] sm:text-xs" /> Verified
                                    </span>
                                )}
                            </h1>


                            {/* Social Media Icons rendering*/}
                            <div className="justify-center md:justify-start gap-2 md:gap-3">
                                {parsedLinks.length > 0 ? (
                                    parsedLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url.startsWith('http') ? social.url : `https://${social.url}`} // Ensure the URL starts with 'http' or 'https'
                                            target="_blank"
                                            className="btn btn-circle btn-sm md:btn-md btn-ghost hover:bg-white/10"
                                        >
                                            {social.platform === "facebook" && <FaFacebook className="text-lg md:text-xl"/>}
                                            {social.platform === "instagram" && <FaInstagram className="text-lg md:text-xl"/>}
                                            {social.platform === "twitter" && <FaTwitter className="text-lg md:text-xl"/>}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm md:text-base">No social media links available.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="md:hidden bg-base-100 shadow-lg">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    <div className="flex flex-col gap-3">
                        {/* Address Section */}
                        {vendor.address ? (
                            <div className="flex flex-col gap-2">
                                {/* Address and Copy Button */}
                                <div className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0"/>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">Address</p>
                                        <div className="flex items-start gap-1">
                                            <span className="text-sm break-words">{vendor.address}</span>
                                            <button
                                                onClick={() => copyToClipboard(vendor.address)}
                                                className="btn btn-ghost btn-xs p-1"
                                            >
                                                <FaCopy className="text-xs"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Preview (No Card) */}
                                <h2 className="font-medium text-sm flex items-center gap-2">
                                    <FaMap className="text-primary"/> Location
                                </h2>
                                <div className="aspect-video rounded-lg overflow-hidden">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(vendor.address)}&output=embed`}
                                        className="w-full h-full"
                                    />
                                </div>

                                {/* Copy Button Below Map */}
                                <button
                                    className="btn btn-outline mt-2 hover:bg-primary/10"
                                    onClick={() => copyToClipboard(vendor.address)}
                                >
                                    <FaCopy/> Copy Address
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Address not available.</p>
                        )}

                        {vendor.phone && (
                            <div className="flex items-start gap-2">
                                <FaPhone className="text-primary mt-1 flex-shrink-0"/>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Phone</p>
                                    <a href={`tel:${vendor.phone}`} className="text-sm link link-hover">
                                        {vendor.phone}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Opening Hours Card - Now in left column */}
                       <div className="bg-base-100 lg:shadow-md card-body sm:p-6">
                            <h2  className="card-title text-lg sm:text-xl mb-3">Opening Hours</h2>
                            <div className="space-y-2">
                                {Array.isArray(openingHours) && openingHours.length > 0 ? (
                                    openingHours.map((hours, index) => {
                                        const isOpen = checkIfOpen(hours);
                                        return (
                                            <div
                                                key={index}
                                                className={`flex justify-between items-center p-3 rounded-lg shadow-sm transition-all hover:bg-base-300 ${isOpen ? 'bg-success/10' : 'bg-base-200'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-primary text-sm"/>
                                                    <span className="font-medium text-sm">{hours.day}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isOpen ? (
                                                        <>
                                                            <div
                                                                className="w-2 h-2"></div>
                                                            <FaClock className="text-primary text-sm"/>
                                                            <span
                                                                className="text-sm">{hours.open} - {hours.close}</span>
                                                            <span
                                                                className="text-success font-medium">Open</span> {/* Separate Open Text */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span
                                                                className="text-gray-500 text-sm">{hours.open} - {hours.close}</span>
                                                            <span
                                                                className="text-red-500 font-medium">Closed</span> {/* Separate Closed Text */}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-2">Opening hours not available</p>
                                )}
                            </div>
                        </div>

                        {/* Social Media Card - Desktop */}
                        <div className="hidden md:block card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Social Media</h2>
                                <div className="flex flex-wrap gap-3">
                                    {parsedLinks.length > 0 ? (
                                        parsedLinks.map((social, index) => (
                                            <a
                                                key={social.platform}
                                                href={social.url}
                                                className="btn btn-circle hover:btn-primary transform hover:scale-110 transition-all"
                                            >
                                                {social.platform === "facebook" &&
                                                    <FaFacebook className="text-xl"/>}
                                                {social.platform === "instagram" &&
                                                    <FaInstagram className="text-xl"/>}
                                                {social.platform === "twitter" && <FaTwitter className="text-xl"/>}
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm md:text-base">No social media links
                                            available.</p>
                                    )}

                                </div>
                            </div>
                            {/* Phone Section */}
                            {vendor.phone && (
                                <div className="flex items-center gap-3 bg-white-200 p-3 rounded-lg shadow-sm">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-md">
                                        <FaPhone className="text-lg"/>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-600">Phone</p>
                                        <a href={`tel:${vendor.phone}`} className="text-base font-semibold text-primary hover:underline">
                                            {vendor.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="lg:col-span-2 space-y-4 -mt-4">
                        {/* Address & Location Card - Hidden on mobile */}
                        <div className="card bg-base-100 shadow-sm hidden md:block">
                            <div className="card-body p-4 sm:p-6">
                                <h2 className="card-title text-lg sm:text-xl mb-3">Location</h2>
                                {vendor.address ? (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0"/>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">Address</p>
                                                <div className="flex items-start gap-1">
                                                    <span className="text-sm break-words">{vendor.address}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(vendor.address)}
                                                        className="btn btn-ghost btn-xs p-1"
                                                    >
                                                        <FaCopy className="text-xs"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <iframe
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(vendor.address)}&output=embed`}
                                                className="w-full h-full"
                                            />
                                        </div>

                                        <button
                                            className="btn btn-outline w-full hover:bg-primary/10"
                                            onClick={() => copyToClipboard(vendor.address)}
                                        >
                                            <FaCopy/> Copy Address
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Address not available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        {/* About Us - Optimized for mobile */}
            <div className="card container mx-auto bg-base-100 shadow-sm">
                <div className="card-body p-3 sm:p-6">
                    <h2 className="card-title text-base sm:text-xl mb-2 sm:mb-3">About Us</h2>
                    <div
                        className="wysiwyg-output text-sm sm:text-base text-base-content/80 break-words"
                        dangerouslySetInnerHTML={{
                            __html: showFullDescription
                                ? vendor.description
                                : `${vendor.description.substring(0, 250)}...`,
                        }}
                    />
                    {vendor.description.length > 250 && (
                        <button
                            className="text-primary font-medium ml-1 hover:underline text-sm"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? "Show Less" : "Read More"}
                        </button>
                    )}
                </div>
            </div>



            {/* Stats section - Optimized for mobile */}
                        <div className="card container mx-auto bg-base-100 shadow-sm">
                            <div className="card-body p-3 sm:p-6">
                                <h2 className="card-title text-base sm:text-xl mb-2 sm:mb-3">Store Statistics</h2>
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div className="stat bg-base-200 rounded-lg p-2 sm:p-4 text-center hover:bg-base-300 transition-colors">
                                        <div className="stat-title text-base-content/70 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                                            <FaBox className="text-primary text-xs sm:text-sm" /> Products
                                        </div>
                                        <div className="stat-value text-primary text-lg sm:text-2xl mt-1">
                                            {vendor.stats?.total_products || 0}
                                        </div>
                                    </div>

                                    <div className="stat bg-base-200 rounded-lg p-2 sm:p-4 text-center hover:bg-base-300 transition-colors">
                                        <div className="stat-title text-base-content/70 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                                            <FaShoppingBag className="text-primary text-xs sm:text-sm" /> Orders
                                        </div>
                                        <div className="stat-value text-primary text-lg sm:text-2xl mt-1">
                                            {vendor.stats?.total_orders || 0}
                                        </div>
                                    </div>

                                    <div className="stat bg-base-200 rounded-lg p-2 sm:p-4 text-center hover:bg-base-300 transition-colors">
                                        <div className="stat-title text-base-content/70 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                                            <FaStar className="text-primary text-xs sm:text-sm" /> Rating
                                        </div>
                                        <div className="stat-value text-primary text-lg sm:text-2xl mt-1">
                                            {vendor.stats?.average_rating?.toFixed(1) || 0}
                                        </div>
                                        <div className="stat-desc text-[10px] sm:text-xs mt-0.5">Based on reviews</div>
                                    </div>
                                </div>
                            </div>
                        </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-left">
                    Our Products
                </h2>

                {products.data.length > 0 ? (
                    <div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {products.data.map(product => (
                            <div
                                key={product.id}
                                className="bg-base-100 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <ProductItem product={product}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <img
                            src="/images/empty-products.svg"
                            alt="No Products"
                            className="w-32 md:w-48 mb-4 opacity-70"
                        />
                        <p className="text-gray-500 text-lg">No products available yet</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>

    );

}


export default Profile;
