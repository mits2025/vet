import { Image } from '@/types';
import { useEffect, useState } from "react";

function Carousel({ images }: { images: Image[] }) {
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]); // ✅ Correct dependency array

    return (
        <>
            <div className="flex items-start gap-8">
                {/* Thumbnail Selector */}
                <div className="flex flex-col items-center gap-2 py-2">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            className={`border-2 ${
                                selectedImage && selectedImage.id === image.id
                                    ? 'border-gray-500'
                                    : 'hover:border-gray-800'
                            }`}
                        >
                            <img src={image.thumb} alt="" className="w-[70px]" />
                        </button>
                    ))}
                </div>

                {/* Display Selected Large Image */}
                <div className="w-full">
                    {selectedImage && (
                        <img src={selectedImage.large} className="w-full" alt="" />
                    )}
                </div>
            </div>
        </>
    );
}

export default Carousel;
