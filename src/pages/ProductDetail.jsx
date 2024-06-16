import { useState } from "react";
import { FaStar } from "react-icons/fa";
// import { RadioGroup } from "@headlessui/react";
import { useParams } from "react-router-dom";
// import { addProductInCart } from "../../services/User/Cart/cartAPI";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { addProductInWishlist } from "../../services/User/Wishlist/wishListApi";
import { useSelector } from "react-redux";
import getEditProduct from "../hooks/getEditProduct";
import Spinner from "../utils/Spinner";
import { useForm } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { addProductInCart } from "../services/Cart/cartAPI";
import { addProductInWishlist } from "../services/Wishlist/wishlistAPI";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetail = () => {
  const { slug } = useParams();
  console.log("🚀 ~ ProductDetail ~ slug:", slug);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const {
    data: productData,
    productGetSuccess,
    isFetching,
  } = getEditProduct(slug);

  //   <---------- Add Product Into Cart -------------->
  //   const { handleSubmit } = useForm({
  //     // resolver: yupResolver(brandAddValidation),
  //   });

  const { isPending, mutate } = useMutation({
    mutationFn: (data) => addProductInCart(data, token),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Product Add Into Cart Successfully");
      setSelectedColor(null);
      setSelectedSize(null);
      queryClient.invalidateQueries("allCart");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selectedColor) {
      toast.error("Please select a Color 🙏");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a Size 🙏");
      return;
    }
    const cartData = {
      colorId: selectedColor,
      sizeId: selectedSize,
      productId: productData?._id,
    };
    console.log("formdata", cartData);
    mutate(cartData);
  };

  //<---------- Add Product Into Wishlist -------------->
  const { handleSubmit: handleWishSubmit } = useForm();

  const { isPending: isPendingWish, mutate: mutateWishlist } = useMutation({
    mutationFn: (data) => addProductInWishlist(data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Product Add Into Wishlist Successfully");
      // queryClient.invalidateQueries("allCart");
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  const onWishlistSubmit = (e) => {
    e.preventDefault();
    const wishlistData = {
      productSlug: slug,
    };
    console.log("wishlistData", wishlistData);
    mutateWishlist(wishlistData);
  };

  return (
    <>
      {isFetching ? (
        <div className="flex items-center justify-center vh-100">
          <Spinner />
        </div>
      ) : (
        <div>
          {productGetSuccess && productData && productData.coverImage && (
            <div className="bg-white">
              <div className="pt-6">
                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                  <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block">
                    <img
                      src={`http://localhost:3000/${productData.coverImage}`}
                      alt={`http://localhost:3000/${productData.coverImage}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                      <img
                        alt={`http:///${productData.images[0]}`}
                        src={`http://localhost:3000/${productData.coverImage}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                      <img
                        alt={`http://localhost:3000/${productData.images[1]}`}
                        src={`http://localhost:3000/${productData.coverImage}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                    <img
                      alt={`http://localhost:3000/${productData.images[2]}`}
                      src={`http://localhost:3000/${productData.coverImage}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Product info */}
                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                  <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {productData?.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      {productData?.category?.name}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="mt-4 lg:row-span-3 lg:mt-0">
                    <h2 className="sr-only">Product information</h2>
                    <div className="flex">
                      <p className="text-3xl tracking-tight text-green-600">
                        ${productData.price}
                      </p>
                    </div>

                    {/* Reviews */}
                    <div className="mt-6">
                      <h3 className="sr-only">Reviews</h3>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <FaStar
                              key={rating}
                              className={classNames(
                                reviews.average > rating
                                  ? "text-gray-900"
                                  : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="sr-only">
                          {reviews.average} out of 5 stars
                        </p>
                        <a
                          href={reviews.href}
                          className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          {reviews.totalCount} reviews
                        </a>
                      </div>
                    </div>

                    <form className="mt-10">
                      {/* Colors */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Color
                        </h3>
                        <RadioGroup
                          value={selectedColor}
                          onChange={setSelectedColor}
                          className="mt-4"
                        >
                          <RadioGroup.Label className="sr-only">
                            Choose a color
                          </RadioGroup.Label>
                          <div className="flex items-center space-x-3">
                            {productData?.color?.map((color) => {
                              return (
                                <RadioGroup.Option
                                  key={color.name}
                                  value={color._id}
                                  className={({ active, checked }) =>
                                    classNames(
                                      active && checked
                                        ? "ring ring-offset-1"
                                        : "",
                                      !active && checked ? "ring-2" : "",
                                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                    )
                                  }
                                >
                                  <RadioGroup.Label
                                    as="span"
                                    className="sr-only"
                                  >
                                    {color.name}
                                  </RadioGroup.Label>
                                  <span
                                    aria-hidden="true"
                                    key={color.name}
                                    className={`bg-${color.name}-600
                                        h-8 w-8 rounded-full border border-black border-opacity-10`}
                                  />
                                </RadioGroup.Option>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Size */}
                      <div className="mt-10">
                        {/* <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            Size
                          </h3>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Size guide
                          </a>
                        </div> */}
                        <RadioGroup
                          value={selectedSize}
                          onChange={setSelectedSize}
                          className="mt-4"
                        >
                          <RadioGroup.Label className="sr-only">
                            Choose a size
                          </RadioGroup.Label>
                          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                            {productData?.size?.map((size) => (
                              <RadioGroup.Option
                                key={size._id}
                                value={size._id}
                                className={({ active, checked }) =>
                                  `group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm
          ${active && checked ? "ring ring-offset-1" : ""}
          ${!active && checked ? "ring-2" : ""}`
                                }
                              >
                                <RadioGroup.Label
                                  as="span"
                                  id={`size-choice-${size._id}-label`}
                                  className="pointer-events-none"
                                >
                                  {size.name}
                                </RadioGroup.Label>
                                <span
                                  className={`pointer-events-none absolute -inset-px rounded-md ${
                                    size.checked ? "border" : "border-2"
                                  } ${
                                    size.checked
                                      ? "border-indigo-500"
                                      : "border-transparent"
                                  }`}
                                  aria-hidden="true"
                                />
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex">
                        <button
                          type="submit"
                          className="mt-10 mr-2 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={(e) => onSubmit(e)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <div className="flex items-center justify-center">
                              <Spinner width={6} height={6} />
                            </div>
                          ) : (
                            "Add To Cart"
                          )}
                        </button>
                        <button
                          type="submit"
                          className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          onClick={(e) => onWishlistSubmit(e)}
                          disabled={isPendingWish}
                        >
                          {isPendingWish ? (
                            <div className="flex items-center justify-center">
                              <Spinner width={6} height={6} />
                            </div>
                          ) : (
                            "Add to Whishlist"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                    {/* Description and details */}
                    <div>
                      <h3 className="sr-only">Description</h3>

                      <div className="space-y-6">
                        <p className="text-base text-gray-900">
                          {productData.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h3 className="text-sm font-medium text-gray-900">
                        Highlights
                      </h3>

                      <div className="mt-4">
                        <ul
                          role="list"
                          className="list-disc space-y-2 pl-4 text-sm"
                        >
                          <li className="text-gray-400">
                            <span className="text-gray-600">
                              Hand cut and sewn locally
                            </span>
                          </li>
                          <li className="text-gray-400">
                            <span className="text-gray-600">
                              Dyed with our proprietary colors
                            </span>
                          </li>
                          <li className="text-gray-400">
                            <span className="text-gray-600">
                              Pre-washed &amp; pre-shrunk
                            </span>
                          </li>
                          <li className="text-gray-400">
                            <span className="text-gray-600">
                              Ultra-soft 100% cotton
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h2 className="text-sm font-medium text-gray-900">
                        Details
                      </h2>

                      <div className="mt-4 space-y-6">
                        <p className="text-sm text-gray-600">
                          The 6-Pack includes two black, two white, and two
                          heather gray Basic Tees. Sign up for our subscription
                          service and be the first to get new, exciting colors,
                          like our upcoming &quot;Charcoal Gray&quot; limited
                          release.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductDetail;
