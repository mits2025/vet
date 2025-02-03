import Checkbox from '@/Components/Core/Checkbox';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Login({
                                  status,
                                  canResetPassword,
                              }: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Log in" />
            <div className="min-h-screen flex">
                {/* Left Side with Gradient Background */}
                <div className="hidden md:block flex-1 bg-gradient-to-br from-blue-600 to-purple-700">
                    <div className="h-full flex flex-col items-center justify-center text-white p-8">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                            <p className="text-lg opacity-90">
                                Sign in to access your personalized dashboard and manage your account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side (Log In Form) */}
                <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8">
                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                            <p className="mt-2 text-gray-600">
                                Or{' '}
                                <Link href={route('register')} className="text-blue-600 hover:text-blue-500 font-medium">
                                    create a new account
                                </Link>
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
                                {status}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="email"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition duration-200"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton
                                disabled={processing}
                                className="w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
                            >
                                Sign in
                            </PrimaryButton>

                            {/* Social Login Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.984 16.815c2.596 0 4.706-2.111 4.706-4.707 0-1.409-.623-2.674-1.606-3.538h-.144l.012.002c-1.022 0-1.945.341-2.707.911-.025-.009-.053-.014-.08-.021-.009-.003-.018-.009-.028-.011h-.003c-.089-.022-.18-.045-.266-.065-.086-.02-.174-.041-.265-.058-.028-.005-.055-.013-.083-.018a4.43 4.43 0 0 0-.542-.081c-.023-.003-.045-.008-.068-.011-.136-.016-.276-.024-.417-.024-2.596 0-4.705 2.11-4.705 4.706s2.11 4.706 4.706 4.706zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.14 15.711c-.597 1.049-1.444 1.902-2.489 2.503-1.048.6-2.225.91-3.455.91-1.344 0-2.594-.344-3.696-.981-.276-.159-.454-.223-.635-.223-.19 0-.38.072-.532.223-.153.152-.223.342-.223.532 0 .19.07.38.223.532.348.347.722.653 1.121.919 1.252.72 2.67 1.091 4.144 1.091 1.474 0 2.892-.371 4.144-1.091 1.252-.72 2.28-1.748 2.999-3 .719-1.252 1.091-2.67 1.091-4.144 0-1.474-.372-2.892-1.091-4.144-.719-1.252-1.747-2.28-2.999-2.999-1.252-.72-2.67-1.091-4.144-1.091-1.474 0-2.892.371-4.144 1.091-1.252.719-2.28 1.747-2.999 2.999-.72 1.252-1.091 2.67-1.091 4.144 0 1.474.371 2.892 1.091 4.144.719 1.252 1.747 2.28 2.999 2.999.276.159.454.223.635.223.19 0 .38-.072.532-.223.153-.152.223-.342.223-.532 0-.19-.07-.38-.223-.532-.159-.159-.341-.223-.532-.223h-.006c-.107 0-.213.021-.314.063-1.049.597-1.902 1.444-2.503 2.489-.6 1.048-.91 2.225-.91 3.455 0 1.344.344 2.594.981 3.696.159.276.223.454.223.635 0 .19-.072.38-.223.532-.152.153-.342.223-.532.223-.19 0-.38-.07-.532-.223a9.007 9.007 0 0 1-.919-1.121C.371 14.892 0 13.474 0 12c0-6.627 5.373-12 12-12s12 5.373 12 12c0 3.015-1.119 5.846-3.168 8.052-2.048 2.206-4.895 3.621-7.954 3.948H12z"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}

