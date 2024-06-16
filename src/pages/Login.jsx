import { Link, useNavigate } from "react-router-dom";
import { loginValidation } from "../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { setLogin } from "../redux/authSlice";
import { forgotPassApi, loginApi } from "../services/Auth/authAPI";
import Spinner from "../utils/Spinner";
import { useEffect } from "react";

const Login = () => {
  const isLoggedIn =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  let email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@email.com",
      password: 123456,
    },
    resolver: yupResolver(loginValidation),
  });

  watch((value, { name }) => {
    if (name === "email") {
      email = value.email;
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => loginApi(data),
    onSuccess: (response) => {
      toast.success("Login Successfully");
      const payload = {
        token: response.data.token,
        email: response.data.user.email,
        role: response.data.user.role,
      };
      dispatch(setLogin(payload));
      reset();
      navigate("/");
    },
  });

  const onSubmit = (formData) => {
    mutate(formData);
  };

  // Resend OTP Mutation
  //   const { mutate: forgotMutate } = useMutation({
  //     mutationFn: () => forgotPassApi(email),
  //     onSuccess: () => {
  //       toast.success("OTP Sent Successfully");
  //     },
  //   });

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
                Sign in to your account
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
                    {...register("email")}
                    type="email"
                    id="email"
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
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className={`bg-gray-50 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="••••••••"
                    required=""
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-end justify-end">
                  <span
                    onClick={() => {
                      navigate(
                        email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                          ? `/forgot?email=${encodeURIComponent(email)}`
                          : "/forgot"
                      );
                    }}
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Forgot password?
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <Spinner width={6} height={6} />
                    </div>
                  ) : (
                    "Sign In"
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

export default Login;