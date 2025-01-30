import {Image} from '@/types'
import {useEffect, useState} from "react";

function Carousel({images}: {images: Image[]}  ) {
    const [selectedImage, setSelectedImage] = useState<Image>(images[0]);

    useEffect(() => {
        setSelectedImage(images[0]);
    }, images);
    return (
        <>
            <div className="flex items-start gap-8 sticky top-20">
                <div className="flex flex-col items-center gap-2 py-2">
                    {images.map((image, i) => (
                        <button
                            onClick={() => setSelectedImage(image)}
                            className={`border-2 ${
                                selectedImage && selectedImage.id === image.id
                                    ? 'border-green-500'
                                    : 'hover:border-green-500'
                            }`}
                            key={image.id}
                        >
                            <img src={image.thumb} alt="" className="w-[70px]" />
                        </button>
                    ))}
                </div>

                <div className="carousel w-full">
                     {images.map((image, i) => (
                         <div id={"item" + i} className="carousel-item w-full " key={image.id}>
                             <img
                             src={image.large}
                             className="w-full"/>
                         </div>
                     ))}
                 </div>
            </div>
        </>
    )
}

export default Carousel;
