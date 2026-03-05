import React from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart, user } = useAppContext();


  // Determine the unit text
  const unitText =
    product.name.toLowerCase() === "assorted icepop" ? "/ box" : "/ pack of 10";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <Link to={`/products/${product.category.toLowerCase()}/${product._id}`}>
        <div className="overflow-hidden p-4 flex justify-center items-center h-52">
          <img
            src={product.image?.[0]}
            alt={product.name}
            className="h-full w-auto object-contain transform hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
      </Link>
      <div className="px-6 pb-6 text-center">
        <h3 className="text-xl font-bold text-[#003B2F] mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">
          ₹{product.offerPrice} {unitText}
        </p>
       <motion.button
  whileTap={{ scale: 0.95 }}
  className="px-5 py-2 bg-[#D4AF37] text-[#003B2F] font-semibold rounded-full hover:opacity-90 transition cursor-pointer "
  onClick={(e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login first!");
      Navigate("/login");
      return;
    }
    addToCart(product._id);
  }}
>
  Add to Cart
</motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
