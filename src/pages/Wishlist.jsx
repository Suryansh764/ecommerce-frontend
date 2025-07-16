import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext"; 
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
 const { addToCart, cart } = useCart();


  if (wishlist.length === 0)
    return <div className="text-center py-5">No items in your wishlist.</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Wishlist</h2>
      <hr />
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {wishlist.map((product) => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow-lg">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text mb-4">{product.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="fw-bold fs-5 text-success">${product.price}</span>
                  <div className="d-flex gap-2">
                   <button
  className="btn btn-primary text-light"
  onClick={async () => {
    const alreadyInCart = cart.some(item => item.product._id === product._id);
    if (alreadyInCart) {
      alert("Product already exists in the cart.");
    } else {
      await addToCart(product._id);
      alert(`${product.title} added to cart.`);
    }
  }}
>
  Add to Cart
</button>


                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
