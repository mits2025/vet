import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { XMarkIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface UploadStoryModalProps {
    vendorId: number;
    onClose: () => void;
    onUploadSuccess: () => void;
}

const UploadStoryModal: React.FC<UploadStoryModalProps> = ({ vendorId, onClose, onUploadSuccess }) => {
    const { register, handleSubmit, reset } = useForm();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Create preview URL
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
        }
    };

    const onSubmit = async (data: any) => {
        if (!file) {
            setError("Please select a file.");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("vendor_id", String(vendorId));
        formData.append("file", file);
        formData.append("caption", data.caption || "");

        try {
            const response = await axios.post('/web/vendor-stories/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data) {
                reset();
                setFile(null);
                setPreview(null);
                onUploadSuccess();
                onClose();
            }
        } catch (error: any) {
            setError(error.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-[70]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create New Story</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* File Upload Area */}
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl 
                                    transition-colors cursor-pointer
                                    ${preview 
                                        ? 'border-transparent' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                            >
                                {preview ? (
                                    <div className="relative w-full h-full">
                                        {file?.type.startsWith('video/') ? (
                                            <video 
                                                src={preview} 
                                                className="w-full h-full object-contain rounded-lg"
                                                controls
                                            />
                                        ) : (
                                            <img 
                                                src={preview} 
                                                alt="Preview" 
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Image or video up to 20MB
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Caption Input */}
                        <div>
                            <input
                                {...register("caption")}
                                type="text"
                                placeholder="Write a caption..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                    focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 
                                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-4 py-2 rounded-lg bg-blue-600 text-white 
                                    ${uploading 
                                        ? 'opacity-75 cursor-not-allowed' 
                                        : 'hover:bg-blue-700 active:bg-blue-800'
                                    } transition-colors`}
                            >
                                {uploading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : 'Share Story'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadStoryModal;
