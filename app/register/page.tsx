"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError, login, register, saveAuthTokens } from "@/services/api";
import { CallToActionHeader } from "@/components/layout/CallToActionHeader";

type Fields = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  city: "",
  zipcode: "",
};

const validate = (fields: Fields): Errors => {
  const errors: Errors = {};
  (Object.keys(fields) as Array<keyof Fields>).forEach((field) => {
    if (!fields[field].trim()) errors[field] = "Dette felt er påkrævet.";
  });
  if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email))
    errors.email = "Indtast en gyldig e-mailadresse.";
  if (fields.password && fields.password.length < 8)
    errors.password = "Adgangskoden skal være mindst 8 tegn.";
  return errors;
};

export default function RegisterPage() {
  const router = useRouter();
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await register(fields);
      const response = await login(fields.email, fields.password);
      saveAuthTokens(response.accessToken, response.refreshToken);
      router.push("/min-side");
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Registreringen kunne ikke gennemføres. E-mailen kan allerede være i brug.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name: keyof Fields, label: string, type = "text") => (
    <div className="register-field" key={name}>
      <label htmlFor={`register-${name}`}>{label}</label>
      <input
        id={`register-${name}`}
        type={type}
        value={fields[name]}
        onChange={(event) => update(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <main className="login-page">
      <CallToActionHeader />
      <section className="login-intro">
        <div className="layout-container">
          <h1>Opret dig som bruger</h1>
          <p>
            Opret en profil hos Gratissimo og få adgang til at gemme jobannoncer
            <br />
            og finde frivillige muligheder, der passer til dig.
          </p>
          <Link href="/login">Har du allerede en bruger? Log ind</Link>
        </div>
      </section>
      <section className="login-form-section login-form-section--register">
        <div className="login-form-container">
          <h2>Opret bruger</h2>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="register-fields">
              {field("firstname", "Fornavn")}
              {field("lastname", "Efternavn")}
              {field("email", "Email", "email")}
              {field("password", "Password", "password")}
              {field("phone", "Telefon")}
              {field("address", "Adresse")}
              {field("city", "By")}
              {field("zipcode", "Postnummer")}
            </div>
            {error && (
              <p className="login-form__error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button--small"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Opretter..." : "Opret bruger"}
            </button>
          </form>
          <Link className="login-card__back" href="/login">
            Tilbage til login
          </Link>
        </div>
      </section>
    </main>
  );
}
