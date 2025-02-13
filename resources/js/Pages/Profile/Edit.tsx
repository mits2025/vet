import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateCustomerForm from './Partials/UpdateCustomerForm';
import VendorRequestForm from "./Partials/VendorRequestForm";


export default function Edit({
                                 customer,
                                 vendor,
                                 mustVerifyEmail,
                                 status,
                             }: PageProps<{ mustVerifyEmail: boolean; status?: string; customer?: any; vendor?: any}>) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 p-4">
                        EDIT PROFILE
                    </h2>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateCustomerForm customer={customer} />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <VendorRequestForm vendor={vendor} />

                    </div>


                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdatePasswordForm />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
