import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Checkbox} from "@headlessui/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register" />
            <div className="min-h-screen flex">
                {/* Left Side with Gradient Background */}
                <div className="hidden md:block flex-1 bg-gradient-to-br from-blue-600 to-purple-700">
                    <div className="h-full flex flex-col items-center justify-center text-white p-8">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
                            <p className="text-lg opacity-90">
                                Create your account to unlock exclusive features and personalized content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side (Registration Form) */}
                <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8">
                    <div className="w-full max-w-md space-y-6">
                        {/* Header */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Create New Account</h2>
                            <p className="mt-2 text-gray-600">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-blue-600 hover:text-blue-500 font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-sm font-medium text-gray-700"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-center">
                                <Checkbox
                                    name="terms"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                            I agree to the{' '}
                                    <Link href="#" className="text-blue-600 hover:text-blue-500">
                                Terms of Service
                            </Link>
                        </span>
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton
                                disabled={processing}
                                className="w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
                            >
                                Create Account
                            </PrimaryButton>

                            {/* Social Login Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                {/* Social buttons same as login page */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
