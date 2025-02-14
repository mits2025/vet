import React, {useState} from 'react';
import { PageProps, Product, PaginationProps, Vendor } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ProductItem from "@/Components/App/ProductItem";
import {FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCopy, FaCalendarAlt, FaClock} from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Profile({ vendor, products }: PageProps<{ vendor: Vendor, products: PaginationProps<Product> }>) {
    const openingHours = typeof vendor.opening_hours === "string"
        ? JSON.parse(vendor.opening_hours)
        : vendor.opening_hours;
    const socialMediaLinks = typeof vendor.social_media_links === "string"
        ? JSON.parse(vendor.social_media_links)
        : vendor.social_media_links;
    const [showFullDescription, setShowFullDescription] = useState(false);
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Address copied to clipboard!"); // You can replace this with a toast notification
        }).catch(err => console.error("Failed to copy: ", err));
    };
/*need for commit*/
    return (
        <AuthenticatedLayout>
            <Head title={`${vendor?.store_name || 'Vendor'} Profile`} />

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
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-100">
                                <img
                                    src={`/storage/${vendor.profile_image}`}
                                    alt={vendor.store_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-white text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3 line-clamp-2">
                                {vendor.store_name}
                            </h1>

                            {/* Social Media Icons */}
                            <div className="flex justify-center md:justify-start gap-2 md:gap-3">
                            {socialMediaLinks && socialMediaLinks.length > 0 ? (
                                socialMediaLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        className="btn btn-circle btn-sm md:btn-md btn-ghost hover:bg-white/10"
                                    >
                                        {social.platform === "facebook" && <FaFacebook className="text-lg md:text-xl" />}
                                        {social.platform === "instagram" && <FaInstagram className="text-lg md:text-xl" />}
                                        {social.platform === "twitter" && <FaTwitter className="text-lg md:text-xl" />}
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
                            <div className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Address</p>
                                    <div className="flex items-start gap-1">
                                        <span className="text-sm break-words">{vendor.address}</span>
                                        <button
                                            onClick={() => copyToClipboard(vendor.address)}
                                            className="btn btn-ghost btn-xs p-1"
                                        >
                                            <FaCopy className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Address not available.</p>
                        )}
                        {vendor.phone && (
                            <div className="flex items-start gap-2">
                                <FaPhone className="text-primary mt-1 flex-shrink-0" />
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
                        {/* Contact Card - Desktop */}
                        <div className="hidden md:block card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Contact</h2>
                                <div className="space-y-2">
                                {vendor.address ? (
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-primary" />
                                            <div className="flex-1">
                                                <p className="font-medium">Address</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm">{vendor.address}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(vendor.address)}
                                                        className="btn btn-xs btn-ghost"
                                                    >
                                                        <FaCopy className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Address not available.</p>
                                    )}

                                    {vendor.phone && (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-primary" />
                                            <div className="flex-1">
                                                <p className="font-medium">Phone</p>
                                                <a href={`tel:${vendor.phone}`} className="text-sm link link-hover">
                                                    {vendor.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Media Card - Desktop */}
                        <div className="hidden md:block card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h2 className="card-title mb-3">Social Media</h2>
                                <div className="flex flex-wrap gap-3">
                                    {socialMediaLinks?.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            className="btn btn-outline btn-sm gap-2"
                                        >
                                            {social.platform === "facebook" && <FaFacebook />}
                                            {social.platform === "instagram" && <FaInstagram />}
                                            {social.platform === "twitter" && <FaTwitter />}
                                            <span className="capitalize">{social.platform}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column (Description) */}
                    <div className="lg:col-span-2 space-y-4 -mt-8">
                        <div className="card bg-base-100 shadow-sm">
                            <div className="card-body p-4 sm:p-6">
                                <h2 className="card-title text-lg sm:text-xl mb-3">About Us</h2>
                                <p className="text-sm sm:text-base text-gray-600 break-words">
                                    {showFullDescription
                                        ? vendor.description
                                        : `${vendor.description.substring(0, 250)}...`}
                                    {vendor.description.length > 250 && (
                                        <button
                                            className="text-primary font-semibold ml-2 hover:underline"
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                        >
                                            {showFullDescription ? "Show Less" : "Read More"}
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Opening Hours Card */}
                        {/* Opening Hours Card */}
                        <div className="card bg-base-100 shadow-sm">
                            <div className="card-body p-4 sm:p-6">
                                <h2 className="card-title text-lg sm:text-xl mb-3">Opening Hours</h2>
                                <div className="space-y-2">
                                    {Array.isArray(openingHours) && openingHours.length > 0 ? (
                                        openingHours.map((hours, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-3 bg-white-200 rounded-lg shadow-sm transition-all hover:bg-base-300"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-primary text-sm" />
                                                    <span className="font-medium text-sm">{hours.day}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-primary text-sm" />
                                                    <span className="text-sm">
                                                        {hours.open} - {hours.close}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-2">Opening hours not available</p>
                                    )}
                                </div>
                            </div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {products.data.map(product => (
                            <div
                                key={product.id}
                                className="bg-base-100 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <ProductItem product={product} />
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
