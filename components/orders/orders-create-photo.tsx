import { useState } from "react";
import { Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function OrdersCreatePhoto({photos,setPhotos}:{photos:File[],setPhotos:React.Dispatch<React.SetStateAction<File[]>>}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);

    e.target.value = "";
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    if (activeIndex === index) setActiveIndex(null);
  };

  const handlePrev = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
      setZoom(1);
    }
  };

  const handleNext = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % photos.length);
      setZoom(1);
    }
  };


  return (
    <div className="text-gray-500 text-center">
      <div className="flex justify-center mb-4">
        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Plus size={20} />
          Добавить фото
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddPhoto}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
           <Image
              onClick={()=>setActiveIndex(index)}
              src={URL.createObjectURL(photo)}
              alt={`photo-${index}`}
              width={150}
              height={150}
              className="object-cover w-full h-32 rounded cursor-pointer"
            />
            <button
              onClick={() => handleDeletePhoto(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>


      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
        >
          <div className="flex justify-between w-full px-4 mb-4 absolute top-5">
            <button
              onClick={() => setActiveIndex(null)}
              className="text-white bg-gray-800 p-2 rounded hover:bg-gray-700 z-50"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={handlePrev}
              className="absolute left-0 text-white p-2 m-2 bg-gray-800 rounded-full hover:bg-gray-700 z-50"
            >
              <ChevronLeft size={30} />
            </button>

          <img
            src={URL.createObjectURL(photos[activeIndex])}
            alt="full"
            style={{ transform: `scale(${zoom})` }}
            className="max-h-[80vh] max-w-[80vw] rounded transition-transform"
          />

            <button
              onClick={handleNext}
              className="absolute right-0 text-white p-2 m-2 bg-gray-800 rounded-full hover:bg-gray-700 z-50"
            >
              <ChevronRight size={30} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
