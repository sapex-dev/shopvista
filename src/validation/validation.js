import * as Yup from "yup";

// <--------------- Auth Validation ------------------>

export const loginValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerValidation = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  password: Yup.string()
    .required("Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
  email: Yup.string().email("Invalid email address").required("Required"),
});

export const forgotPassValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
});

export const resetPassValidation = Yup.object().shape({
  password: Yup.string()
    .required("Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
});

// <----------- Product Validation ----------------->

export const priceValidation = Yup.object().shape({
  minPrice: Yup.number()
    .optional()
    .typeError("Min Price must be a number")
    .integer("Min Price must be an integer")
    .positive("Min Price must be a positive number"),
  maxPrice: Yup.number()
    .optional()
    .typeError("Max Price must be a number")
    .integer("Max Price must be an integer")
    .positive("Max Price must be a positive number")
    .when("minPrice", (minPrice, schema) => {
      return minPrice
        ? schema.test(
            "maxPrice",
            "Max Price must be greater than or equal to Min Price",
            function (maxPrice) {
              return maxPrice === undefined || maxPrice >= minPrice;
            }
          )
        : schema;
    }),
});

// <----------- Address Validation ----------------->

export const addressAddValidation = Yup.object().shape({
  alias: Yup.string().required("Alias is required"),
  details: Yup.string().required("Details is required"),
  phone: Yup.string().required("Phone is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal Code is required"),
});
