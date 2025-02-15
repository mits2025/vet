import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import UploadStoryModal from "./UploadStoryModal";
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Story {
    id: number;
    image?: string;
    video?: string;
    caption?: string;
}

const StoryCarousel = ({ vendorId, isOwner, onClose }: {
    vendorId: number;
    isOwner: boolean;
    onClose: () => void;
}) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    console.log('StoryCarousel Mount:', { vendorId, isOwner });

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch(`/vendor-stories/${vendorId}`);
                const data = await res.json();

                console.log('Stories Response:', data);

                if (res.ok) {
                    setStories(data);
                } else {
                    console.error('Failed to fetch stories:', data);
                }
            } catch (error) {
                console.error("Error fetching stories:", error);
            }
        };

        fetchStories();
    }, [vendorId]);

    console.log('Current Stories:', stories);

    return (
            <div className="mt-10 fixed inset-0 z-50 flex items-center justify-center">
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>

                <div className="relative z-10 w-full max-w-2xl">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    {/* Story counter */}
                    <div className="absolute top-8 left-0 right-0 z-20 flex justify-center gap-1 px-4">
                        {stories.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 flex-1 max-w-16 rounded-full transition-all duration-200 ${
                                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>

                    {isOwner && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="absolute top-20 right-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-full
               text-lg font-semibold shadow-md hover:bg-blue-700
               transition-all duration-300 transform hover:scale-105"
                        >
                            + Add Story
                        </button>

                    )}

                    {stories.length === 0 ? (
                        <div className="h-[80vh] flex items-center justify-center bg-gray-900 rounded-lg">
                            <p className="text-white">No stories available</p>
                        </div>
                    ) : (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            autoplay={{ delay: 5000 }}
                            pagination={{
                                clickable: true,
                                type: 'bullets',
                            }}
                            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            className="h-[80vh] rounded-lg overflow-hidden"
                        >
                            {stories.map((story) => (
                                <SwiperSlide key={story.id}>
                                    <div className="relative h-full bg-black">
                                        {story.video ? (
                                            <video
                                                src={`/storage/${story.video}`}
                                                className="w-full h-full object-contain"
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                            />
                                        ) : (
                                            <img
                                                src={`/storage/${story.image}`}
                                                alt="Story"
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                        {story.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                                {story.caption}
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    {showUploadModal && (
                        <UploadStoryModal
                            vendorId={vendorId}
                            onClose={() => setShowUploadModal(false)}
                            onUploadSuccess={() => {
                                setShowUploadModal(false);
                                const fetchStories = async () => {
                                    const res = await fetch(`/vendor-stories/${vendorId}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        setStories(data);
                                    }
                                };
                                fetchStories();
                            }}
                        />
                    )}
                </div>
            </div>
    );
};

export default StoryCarousel;
