import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { products, currency, addToCart,user } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    comment: "",
    rating: 5,
  });

  const product = products.find((item) => item._id === id);
  const uniqueImages = [...new Set(product?.image || [])];

  useEffect(() => {
    if (products.length > 0 && product) {
      const sameCategory = products.filter(
        (item) => item.category === product.category && item._id !== id
      );
      setRelatedProducts(sameCategory.slice(0, 5));
    }
  }, [products, product, id]);

  useEffect(() => {
    setThumbnail(uniqueImages[0] || null);
  }, [product]);

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
    setReviews(savedReviews);
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = { ...reviewForm, date: new Date().toISOString() };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
    setReviewForm({ name: "", comment: "", rating: 5 });
    toast.success("Review submitted!");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Product not found.
      </div>
    );
  }

  // Determine unit text
  const unitText =
    product.name.toLowerCase() === "assorted icepop" ? "/ box" : "/ pack of 10";

  return (
    <section className="min-h-screen py-12 px-6 sm:px-16 bg-[#FFFCE8]">
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>{" "}
        / <span className="text-red-500">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Thumbnails & Main Image */}
        <div className="flex gap-4">
          {uniqueImages.length > 1 && (
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {uniqueImages.map((image, index) => (
                <img
                  key={index}
                  onClick={() => setThumbnail(image)}
                  src={image}
                  alt={`thumb-${index}`}
                  className={`w-20 h-20 rounded border cursor-pointer object-cover ${
                    thumbnail === image ? "ring-2 ring-red-400" : ""
                  }`}
                />
              ))}
            </div>
          )}
          <div className="border border-gray-300 rounded-lg max-w-[300px]">
            <img
              src={thumbnail}
              alt="Selected"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#003B2F]">{product.name}</h1>

          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="w-4 h-4"
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">(4)</span>
          </div>

          <div className="mt-6">
            <p className="text-gray-500 line-through text-sm">
              MRP: {currency}
              {product.price}
            </p>
            <p className="text-2xl font-bold text-[#003B2F]">
              ₹{product.offerPrice}{" "}
              <span className="text-sm font-normal text-gray-600 ml-2">
                {unitText} (incl. all taxes)
              </span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-base font-semibold mb-2">About Product</h2>
            <ul className="list-disc text-sm text-gray-700 ml-5 space-y-1">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 mt-8">
            <button
  onClick={() => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login"); 
      return;
    }
    addToCart(product._id);
  }}
  className="w-full py-3.5 bg-gray-100 text-gray-700 rounded font-medium transition duration-300 ease-in-out 
             hover:bg-[#003B2F] hover:text-white hover:shadow-lg cursor-pointer "
>
  Add to Cart
</button>

<button
  onClick={() => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    addToCart(product._id);
    navigate("/cart");
  }}
  className="w-full px-5 py-2 bg-[#D4AF37] text-[#003B2F] font-semibold rounded transition duration-300 ease-in-out 
             hover:bg-[#003B2F] hover:text-white hover:shadow-lg cursor-pointer "
>
  Buy Now
</button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 mt-16 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-[#003B2F] mb-4">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {reviews.map((r, i) => (
              <div key={i} className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{r.name}</strong>{" "}
                    <span className="text-yellow-500 ml-2">{"⭐".repeat(r.rating)}</span>
                  </div>
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm("Delete this review?");
                      if (confirmDelete) {
                        const updated = reviews.filter((rev) => rev.date !== r.date);
                        setReviews(updated);
                        localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
                        toast.success("Review deleted.");
                      }
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <input
            name="name"
            value={reviewForm.name}
            onChange={handleReviewChange}
            placeholder="Your name"
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="comment"
            value={reviewForm.comment}
            onChange={handleReviewChange}
            placeholder="Your review"
            required
            className="w-full border p-2 rounded"
          />
          <select
            name="rating"
            value={reviewForm.rating}
            onChange={handleReviewChange}
            className="w-full border p-2 rounded"
          >
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>
                {val} Star{val > 1 && "s"}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#003B2F] text-white px-5 py-2 rounded hover:opacity-90 transition cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#003B2F]">Related Products</h2>
            <div className="w-20 h-1 mx-auto mt-2 bg-red-400 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
            {relatedProducts
              .filter((item) => item.inStock)
              .map((item, index) => (
                <ProductCard key={index} product={item} />
              ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => {
                navigate("/products");
                scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-5 py-2 bg-red-500 text-white cursor-pointer font-semibold rounded-full transition duration-300 ease-in-out 
             hover:bg-[#003B2F] hover:text-white hover:shadow-md"
            >
              See More
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
