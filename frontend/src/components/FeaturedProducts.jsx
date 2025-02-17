import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";

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

const FeaturedProducts = ({ featuredProducts }) => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex([
      (currentIndex + itemsPerPage) % featuredProducts.length,
      1,
    ]);
  };

  const prevSlide = () => {
    setCurrentIndex([
      (currentIndex - itemsPerPage + featuredProducts.length) %
        featuredProducts.length,
      -1,
    ]);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  if (!Array.isArray(featuredProducts) || featuredProducts.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
            Featured
          </h2>
          <div className="text-center text-white">
            No featured products found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Featured
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex"
              >
                {featuredProducts
                  .slice(currentIndex, currentIndex + itemsPerPage)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-10 transform -translate-y-1/2 p-1 rounded-xl transition-colors duration-300 h-32 ${
              isStartDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-10 transform -translate-y-1/2 p-1 rounded-xl transition-colors duration-300 h-32 ${
              isEndDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
