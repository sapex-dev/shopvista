import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  deleteWishlistItem,
  getWishList,
} from "../services/Wishlist/wishlistAPI";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setWishlist } from "../redux/wishlistSlice";

const WishList = () => {
  const dispatch = useDispatch();
  const WhishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  console.log("🚀 ~ WishList ~ WhishlistItems:", WhishlistItems);
  const queryClient = useQueryClient();

  // <-------- Get All Wishlist Products ---------------->
  const { isSuccess, data } = useQuery({
    queryKey: ["allWishlist"],
    queryFn: getWishList,
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("Wishlist data get successfully 👏🥳:", data);
  }

  useEffect(() => {
    const payload = {
      numOfWishlistItems: data?.numOfCartItems,
      wishlistItems: data?.data?.wishlistItems,
    };
    console.log("🚀 ~ useEffect ~ payload:", payload);
    dispatch(setWishlist(payload));
  }, [data]);

  // Delete item from wishlist
  const { mutate: removeItem, data: deleteData } = useMutation({
    mutationFn: (id) => deleteWishlistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries("allWishlist");
      toast.success("Item Removed Successfully");
    },
  });

  const removeWishlistItem = (itemId) => {
    removeItem(itemId);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-blue-600">
          Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isSuccess &&
            WhishlistItems?.map((item) => {
              // Calculate the time difference
              const expiresAt = new Date(item.expiresAt);
              const currentTime = new Date();
              const timeDiff = Math.abs(expiresAt - currentTime);
              const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

              return (
                <div key={item.product._id} className="relative group">
                  <Link to={`/product/${item.product._id}`} className="block">
                    <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={`http://localhost:3000/${item.product.coverImage}`}
                        alt={item.product.imageAlt}
                        className="object-cover object-center w-full h-full lg:w-full lg:h-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item?.category?.name}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        <p>${item.product.price}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="mt-4 flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-red-600 border border-transparent rounded-md focus:outline-none"
                    onClick={() => removeWishlistItem(item.product._id)}
                  >
                    Remove from wishlist
                  </button>
                  <span className="absolute inline-flex items-center justify-center w-12 h-8 text-s font-bold text-blck  bg-gray-300 border-2 border-white rounded -top-4 -end-3 dark:border-gray-900">
                    {daysDiff} d
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WishList;
