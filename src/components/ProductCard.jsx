/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link className="group relative" to={`/product/${product.slug}`}>
      <div
        className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
        style={{ height: "300px", width: "100%" }}
      >
        <img
          src={product.productCoverImage}
          alt={product.imageAlt}
          className=" object-cover object-center h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a>
              <span aria-hidden="true" className="absolute inset-0" />
              {product?.name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {product?.category?.name}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          <p>${product.price}</p>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
