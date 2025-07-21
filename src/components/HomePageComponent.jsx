import useFetch from "../useFetch";
import { useState } from "react";
import heroImage from "../assets/heroImage.jpg";
import { Link } from "react-router-dom";


import abstractImg from "../assets/abstract.jpg";
import landscapeImg from "../assets/landscape.jpg";
import portraitImg from "../assets/portrait.jpg";
import popImg from "../assets/pop.jpg";
import streetImg from "../assets/street.jpg";
import saleImg from "../assets/sale.jpg";
import exclusiveImg from "../assets/exclusive.jpg";

export default function HomePageComponents({ searchQuery = "" }) {
  const { data, loading, error } = useFetch("https://ecommerce-backend-three-tau.vercel.app/api/categories");
 const categoryArray = data || [];

  const [showAll, setShowAll] = useState(false);


const filteredCategories = categoryArray.filter((category) => {
  const title = category.name || "";
  return title.toLowerCase().includes(searchQuery.trim().toLowerCase());
});



  const categoryImages = {
    "Abstract Art": abstractImg,
    "Landscape & Nature Art": landscapeImg,
    "Figurative & Portrait Art": portraitImg,
    "Pop Art & Graphic Contemporary": popImg,
    "Street & Urban Art": streetImg,
  };

  return (
    <>
      <div className="container-fluid my-4 px-5">
        <h2 className="mb-4 display-2">Available Categories</h2>
      <hr />
        <section>

          {loading && <p>Loading...</p>}
          {error && <p>Error loading products.</p>}
          {!loading && filteredCategories.length === 0 && (
            <p>No product match your search.</p>
          )}


          <div className="row gx-4 gy-4 px-3">
            {filteredCategories
              .slice(0, showAll ? filteredCategories.length : 4)
              .map((event) => {
                const imageUrl = categoryImages[event.name];

                return (
                  <div key={event._id} className="col-md-3 mb-4 px-2">
                    <Link
                      to={`/categories/${event._id}`}
                      className="text-decoration-none"
                      style={{ color: "inherit" }}
                    >
                      <div
                        className="card h-100 shadow-sm border-0 position-relative overflow-hidden rounded-4"
                        style={{
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 24px rgba(0,0,0,0.1), 0 0 20px rgba(255,0,150,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                        }}
                      >
                        <img
                          src={imageUrl}
                          className="card-img-top"
                          style={{
                            objectFit: "cover",
                            height: "250px",
                            width: "100%",
                          }}
                          alt={event.name}
                        />
                        <div
                          className="position-absolute bottom-0 start-0 w-100 text-center py-2"
                          style={{
                            background: "rgba(255, 255, 255, 0.85)",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            fontFamily: "Trebuchet MS, sans-serif",
                            color: "#333",
                          }}
                        >
                          {event.name}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>


          {filteredCategories.length > 4 && (
            <div className="text-center my-3">
              <button
                className="btn btn-outline-dark px-4 py-2 rounded-pill shadow-sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </section>


        <section className="my-5">
          <img
            src={heroImage}
            className="img-fluid rounded shadow"
            style={{ width: "100%", maxHeight: "700px", objectFit: "cover" }}
            alt="hero"
          />
        </section>
        <section className="my-5 px-5">
  <div className="row gx-4 gy-4">

    <div className="col-md-6">
      <Link to="/exclusive" className="text-decoration-none">
        <div
          className="position-relative overflow-hidden rounded-4 shadow-lg"
          style={{
            height: "350px",
            backgroundImage: `url(${exclusiveImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              fontFamily: "Trebuchet MS, sans-serif",
            }}
          >
            <h2 className="fw-bold display-6">Exclusive Paintings</h2>
            <p className="fs-5">Limited pieces, handpicked by curators</p>
            <button className="btn btn-outline-light mt-2 rounded-pill px-4 py-2">
              Explore Now
            </button>
          </div>
        </div>
      </Link>
    </div>


    <div className="col-md-6">
      <Link to="/sale" className="text-decoration-none">
        <div
          className="position-relative overflow-hidden rounded-4 shadow-lg"
          style={{
            height: "350px",
            backgroundImage: `url(${saleImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              fontFamily: "Trebuchet MS, sans-serif",
            }}
          >
            <h2 className="fw-bold display-6">Sale on Artworks</h2>
            <p className="fs-5">Grab originals at up to 50% off</p>
            <button className="btn btn-outline-light mt-2 rounded-pill px-4 py-2">
              Shop the Sale
            </button>
          </div>
        </div>
      </Link>
    </div>
  </div>
</section>
<section>
  <div className="text-center my-5">
  <Link to="/products" className="text-decoration-none">
    <button
      className="px-5 py-3 fw-semibold fs-5 shadow"
      style={{
        background: "linear-gradient(135deg, #fce3ec, #ffc8c8)",
        border: "none",
        borderRadius: "2rem",
        color: "#333",
        fontFamily: "'Trebuchet MS', sans-serif",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
      }}
    >
      Browse Complete Collection →
    </button>
  </Link>
</div>
</section>

      </div>
    </>
  );
}
