"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError, login, saveAuthTokens } from "@/services/api";
import { CallToActionHeader } from "@/components/layout/CallToActionHeader";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await login(username.trim(), password);
      saveAuthTokens(response.accessToken, response.refreshToken);
      router.push("/min-side");
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Login kunne ikke gennemføres.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <CallToActionHeader />
      <section className="login-intro">
        <div className="layout-container">
          <h1>Log ind eller opret dig som bruger</h1>
          <p>
            Når du opretter en profil på Gratissimo får du adgang til at
            oprette, slette og
            <br /> redigere jobannoncer. Som arbejdsgiver får du mulighed for at
            gøre de jobs,
            <br /> du kunne være interesseret i.
          </p>
          <Link href="/login">Log ind for at gå til min side</Link>
        </div>
      </section>
      <section className="login-form-section">
        <div className="login-form-container">
          <h2>Log ind</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-username">Email</label>
            <input
              id="login-username"
              type="email"
              placeholder="Skriv din email..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Skriv dit password..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
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
              {submitting ? "Logger ind..." : "Log ind"}
            </button>
          </form>
          <Link className="login-card__back" href="/register">
            Opret bruger
          </Link>
        </div>
      </section>
    </main>
  );
}
