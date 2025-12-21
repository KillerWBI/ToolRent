"use client";

import { api } from "@/lib/api/api";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import "./BookingToolForm.css";
import { SuccessBookung } from "./SuccessBookng";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface BookingFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  city: string;
  postOffice: string;
}

interface BookedDate {
  from: string;
  to: string;
}

interface Tool {
  _id: string;
  name: string;
  pricePerDay: number;
  bookedDates: BookedDate[];
}

interface Props {
  tool: Tool;
}

export default function BookingToolForm({ tool }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [successForm , setsuccessForm] = useState<boolean>(false);



  const formik = useFormik<BookingFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      startDate: "",
      endDate: "",
      city: "",
      postOffice: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Мінімум 2 символи")
        .required("Імʼя обовʼязкове"),
      lastName: Yup.string()
        .min(2, "Мінімум 2 символи")
        .required("Прізвище обовʼязкове"),
      phone: Yup.string()
        .matches(/^\+?[0-9]{10,15}$/, "Некоректний номер телефону")
        .required("Телефон обовʼязковий"),
      startDate: Yup.date().required("Оберіть дату початку"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "Дата завершення не може бути раніше")
        .required("Оберіть дату завершення"),
      city: Yup.string().required("Місто обовʼязкове"),
      postOffice: Yup.string().required("Відділення обовʼязкове"),
    }),

    onSubmit: async (values, { setSubmitting,  resetForm }) => {
      setStatus(null);
      try {
        setSubmitting(true);

        const start = new Date(values.startDate);
        const end = new Date(values.endDate);

        // Проверка пересечения с bookedDates
        const conflict = tool.bookedDates.find((b) => {
          const bookedStart = new Date(b.from);
          const bookedEnd = new Date(b.to);
          return start <= bookedEnd && end >= bookedStart;
        });

        if (conflict) {
          setStatus(
            `Інструмент зайнятий з ${new Date(
              conflict.from
            ).toLocaleDateString()} по ${new Date(
              conflict.to
            ).toLocaleDateString()}`
          );
          toast.error(`Інструмент зайнятий з ${new Date(
              conflict.from
            ).toLocaleDateString()} по ${new Date(
              conflict.to
            ).toLocaleDateString()}`)
          return;
                }

        // Подготовка данных для отправки на бэк
        const payload = {
  toolId: tool._id,

  startDate: new Date(values.startDate).toISOString(),
  endDate: new Date(values.endDate).toISOString(),

  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  phone: values.phone.trim(),
  deliveryCity: values.city.trim(),
  deliveryBranch: values.postOffice.trim(),
};

        console.log("SEND TO API:", payload);
        await api.post("/api/booking", payload);
         setStatus("✅ Бронювання успішне");
         toast.success("Бронювання успішне")
          resetForm();
          setsuccessForm(true);
      } catch {
        setStatus("Помилка при бронюванні");
        toast.error("Помилка при бронюванні")
      } finally {
        setSubmitting(false);
      }
    },

  });

  const totalPrice = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return 0;
    const start = new Date(formik.values.startDate);
    const end = new Date(formik.values.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    return days > 0 ? days * tool.pricePerDay : 0;
  }, [formik.values.startDate, formik.values.endDate, tool.pricePerDay]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;

  return (
    <main className="container-booking">
      <div><Toaster/></div>
      <div className="formSection">
      {successForm ? (
        <SuccessBookung/>
      ) : (
        <>
          <h1 className="title">Підтвердження бронювання</h1>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="label">Імʼя</span>
            <input
              className={`input ${touched.firstName && errors.firstName ? "inputError" : ""}`}
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваше імʼя"
            />
            {touched.firstName && errors.firstName && (
              <span className="errorText">{errors.firstName}</span>
            )}
          </label>

          <label className="field">
            <span className="label">Прізвище</span>
            <input
              className={`input ${touched.lastName && errors.lastName ? "inputError" : ""}`}
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваше прізвище"
            />
            {touched.lastName && errors.lastName && (
              <span className="errorText">{errors.lastName}</span>
            )}
          </label>

          <label className="field">
            <span className="label">Номер телефону</span>
            <input
              className={`input tel ${touched.phone && errors.phone ? "inputError" : ""}`}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+38 (XXX) XXX XX XX"
            />
            {touched.phone && errors.phone && (
              <span className="errorText">{errors.phone}</span>
            )}
          </label>

         <label className="field">
  <span className="label">Дата початку</span>

  <DatePicker
    selected={
      values.startDate ? new Date(values.startDate) : undefined
    }
    onChange={(date: Date | null) => {
      formik.setFieldValue(
        "startDate",
        date ? date.toISOString().split("T")[0] : ""
      );
    }}
    dateFormat="dd.MM.yyyy"
    placeholderText="Оберіть дату"
    className={`input calendar-input ${
      touched.startDate && errors.startDate ? "inputError" : ""
    }`}
    popperClassName="calendar-popper"
  />

  {touched.startDate && errors.startDate && (
    <span className="errorText">{errors.startDate}</span>
  )}
</label>


<label className="field">
  <span className="label">Дата завершення</span>

  <DatePicker
    selected={
      values.endDate ? new Date(values.endDate) : undefined
    }
    onChange={(date: Date | null) => {
      formik.setFieldValue(
        "endDate",
        date ? date.toISOString().split("T")[0] : ""
      );
    }}
    minDate={
      values.startDate ? new Date(values.startDate) : undefined
    }
    dateFormat="dd.MM.yyyy"
    placeholderText="Оберіть дату"
    className={`input calendar-input ${
      touched.endDate && errors.endDate ? "inputError" : ""
    }`}
    popperClassName="calendar-popper"
  />

  {touched.endDate && errors.endDate && (
    <span className="errorText">{errors.endDate}</span>
  )}
</label>

          <label className="field">
            <span className="label">Місто доставки</span>
            <input
              className="input"
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="Ваше місто"
            />
          </label>

          <label className="field">
            <span className="label">Відділення Нової Пошти</span>
            <input
              className="input"
              name="postOffice"
              value={values.postOffice}
              onChange={handleChange}
              placeholder="*№15"
            />
          </label>

          <div className="formFooter">
            <div className="priceBlock">
              Вартість: <strong>{totalPrice} грн</strong>
            </div>
          </div>
            <div className="formFooter-sumbit"><button type="submit" className="submit" disabled={isSubmitting}>
              {isSubmitting ? "Бронювання..." : "Забронювати"}
            </button></div>

          {status && <div className="formStatus">{status}</div>}
        </form>
        </>
      )}
      </div>
    </main>
  );
}
