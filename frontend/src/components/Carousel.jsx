import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { id: 1, url: "/crousel1.jpg" },
  { id: 2, url: "/crousel2.jpg" },
  { id: 3, url: "/crousel3.png" },
];

const variants = {
  initial: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.5 },
  }),
};

const Carousel = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  const nextSlide = () => {
    setCurrentIndex([(currentIndex + 1) % images.length, 1]);
  };

  const prevSlide = () => {
    setCurrentIndex([(currentIndex - 1 + images.length) % images.length, -1]);
  };

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8 py-4 bg-gray-900">
      <div className="overflow-hidden rounded-md relative h-64 md:h-80 lg:h-96">
        <AnimatePresence initial={false} custom={direction}>
          {images.map((image, index) => (
            index === currentIndex && (
              <motion.img
                key={image.id}
                src={image.url}
                alt={`Slide ${index}`}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full object-cover absolute"
              />
            )
          ))}
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-500 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-500 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
