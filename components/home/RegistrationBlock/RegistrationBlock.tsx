"use client";

import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./RegistrationBlock.module.css";

export default function RegistrationBlock() {
  const router = useRouter();
  const {isAuthenticated} = useAuthStore();

  const AuthBuutonTools = () => {
    if (isAuthenticated) {
      router.push("/tools");
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.wrapper}>
          <div className={css.textDiv}>
            <h2 className={css.title}>
              {isAuthenticated ? "" : "Зареєструватися i"} отримайте доступ до інструментів поруч із вами
            </h2>
            <p className={css.text}>
              Не витрачайте гроші на купівлю — орендуйте зручно та швидко.
              Приєднуйтесь до ToolNext вже сьогодні!
            </p>
            <button
              type="button"
              onClick={AuthBuutonTools}
              className={css.button}
            >
              {isAuthenticated ? "до інструментів" : "Зареєструватися"}
            </button>
          </div>
          <Image
            src="/image/registerBlockimg.webp"
            alt="shelf with tools"
            width={335}
            height={223}
            className={css.RgImg}
          ></Image>
        </div>
      </div>
    </section>
  );
}
