import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const schema = yup.object().shape({
    username: yup.string().required("نام کاربری الزامی است"),
    password: yup.string().required("رمز عبور الزامی است"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "رمزها یکسان نیستند")
      .required("تایید رمز عبور الزامی است"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", {
        username: data.username,
        password: data.password,
      });
      alert("ثبت‌نام موفق! لطفاً وارد شوید.");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="register-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="register-form"
        noValidate
      >
        <img className="logo" src="/Union.svg" alt="logo" />
        <h2>فرم ثبت‌نام</h2>

        <div className="input-container">
          <input
            placeholder="نام کاربری"
            {...register("username")}
            className={errors.username ? "error" : ""}
          />
          <p className="error_text">{errors.username?.message}</p>
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="رمز عبور"
            {...register("password")}
            className={errors.password ? "error" : ""}
          />
          <p className="error_text">{errors.password?.message}</p>
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="تایید رمز عبور"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "error" : ""}
          />
          <p className="error_text">{errors.confirmPassword?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="register-button"
        >
          {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>

        <p>
          <Link className="Register-link" href="/login">
            <span> حساب کاربری دارید؟</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
