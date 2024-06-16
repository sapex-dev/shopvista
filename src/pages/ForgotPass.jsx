import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassValidation } from "../validation/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassApi } from "../services/Auth/authAPI";
import Spinner from "../utils/Spinner";

const ForgotPass = () => {
  //   const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    if (email != null) {
      setEmail(email);
      setValue("email", email);
    }
  }, [location.search]);

  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPassValidation),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => forgotPassApi(data),
    onSuccess: () => {
      toast.success("Reset Password URL Sent to Your Email");
    //   reset();
        // navigate("/admin");
    },
  });

  const onSubmit = (formData) => {
    console.log("🚀 ~ onSubmit ~ formData:", formData);
    mutate(formData);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
            ShopVista
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Password
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`bg-gray-50 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="name@company.com"
                    required=""
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <Spinner width={6} height={6} />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPass;
