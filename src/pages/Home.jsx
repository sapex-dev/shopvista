import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner";
import { authenticatedInstance } from "../utils/axios-instance";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();

  let query1 = new URLSearchParams(useLocation().search);

  // Get individual parameters
  const queryParam = query1.get("query");
  const minParam = query1.get("min");
  const maxParam = query1.get("max");
  console.log("🚀 ~ Home ~ query1:", query1.get("query"));

  let query = {
    search: null,
    min: null,
    max: null,
  };

  const queryClient = useQueryClient();

  // <-------- Get All Query ---------------->

  const { isSuccess, isFetching, data } = useQuery({
    queryKey: ["allProducts", query1.toString()],
    queryFn: async () => {
      const response = await authenticatedInstance.get(
        query1.toString() ? `product?${query1.toString()}` : `product`
      );
      return response.data?.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isSuccess) {
    console.log("🚀 ~ data:", data);
  }

  const handleRemoveFilter = () => {
    navigate("/");
    queryClient.invalidateQueries(["allProducts"]);
  };

  const handleSearchChange = (e) => {
    query = { ...query, search: e.target.value };
  };

  const handleMinPriceChange = (e) => {
    query = { ...query, min: e.target.value };
  };

  const handleMaxPriceChange = (e) => {
    query = { ...query, max: e.target.value };
  };

  const queryString = (query) => {
    const params = [];

    if (query.search) {
      params.push(`query=${encodeURIComponent(query.search)}`);
    }

    if (query.min) {
      params.push(`min=${encodeURIComponent(query.min)}`);
    }

    if (query.max) {
      params.push(`max=${encodeURIComponent(query.max)}`);
    }

    return params.join("&");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 ~ handleMaxPriceChange ~ query:", query);
    navigate(`?${queryString(query)}`);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center vh-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
          <div className="flex space-x-4  items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-blue-600">
              Products
            </h2>
            <form className="lg:pr-3" onSubmit={handleSubmit}>
              <div className="flex space-x-2 mt-1">
                <div className="relative">
                  <input
                    type="string"
                    placeholder="Search"
                    name="search"
                    defaultValue={queryParam}
                    // value={priceFilter.minPrice}
                    onChange={handleSearchChange}
                    className="border p-2 rounded-md"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min Price"
                    name="minPrice"
                    defaultValue={minParam}
                    // value={priceFilter.minPrice}
                    onChange={handleMinPriceChange}
                    className="border p-2 rounded-md"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max Price"
                    name="maxPrice"
                    defaultValue={maxParam}
                    // value={priceFilter.maxPrice}
                    // onChange={handlePriceFilterChange}
                    onChange={handleMaxPriceChange}
                    className="border p-2 rounded-md"
                  />
                </div>

                <button className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFilter}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                >
                  Remove
                </button>
              </div>
            </form>
          </div>
          {/* {isSuccess && data.length === 0 ? ( */}
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data?.products?.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
