import React, { useState } from "react";
import {useForm} from "react-hook-form";
import axios from "axios";

interface UploadStoryModalProps {
    vendorId: number;
    onClose: () => void;
    onUploadSuccess: () => void; // Callback to refresh stories
}

const UploadStoryModal: React.FC<UploadStoryModalProps> = ({ vendorId, onClose, onUploadSuccess }) => {
    const { register, handleSubmit, reset } = useForm();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Upload Story</h2>
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full border p-2" />

                    <input
                        {...register("caption")}
                        type="text"
                        placeholder="Add a caption (optional)"
                        className="w-full border p-2"
                    />

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancel
                        </button>
                        <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded">
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadStoryModal;
