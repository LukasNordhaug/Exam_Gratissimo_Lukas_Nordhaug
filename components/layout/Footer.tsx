"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ApiError, subscribeToNewsletter } from "@/services/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Indtast en gyldig e-mailadresse.");
      return;
    }

    setSubmitting(true);
    try {
      await subscribeToNewsletter({ email: email.trim() });
      setMessage("Tak! Du er nu tilmeldt nyhedsbrevet.");
      setEmail("");
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Tilmeldingen kunne ikke gennemføres.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="layout-container site-footer__grid">
        <div>
          <h2>For jobsøgere</h2>
          <Link href="/jobs">Find et job</Link>
          <Link href="/min-side">Mine favoritter</Link>
          <Link href="/login">Opret profil</Link>
        </div>
        <div>
          <h2>For arbejdsgivere</h2>
          <Link href="/opret-annonce">Opret annonce</Link>
          <Link href="/login">Opret forening</Link>
          <Link href="/opret-annonce">Sådan fungerer det</Link>
        </div>
        <div>
          <h2>Links</h2>
          <Link href="/nyheder">Nyheder</Link>
          <Link href="/">Om Gratissimo</Link>
          <Link href="/">Privatlivspolitik</Link>
        </div>
        <div className="site-footer__newsletter">
          <h2>Vil du have jobs direkte i din indbakke?</h2>
          <p>Tilmeld dig vores nyhedsbrev.</p>
          <form onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Din e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Din e-mail..."
              aria-describedby="newsletter-feedback"
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "..." : "Tilmeld"}
            </button>
          </form>
          <p
            id="newsletter-feedback"
            className={`form-feedback${error ? " form-feedback--error" : ""}`}
            role="status"
          >
            {error || message}
          </p>
        </div>
        <div className="site-footer__contact">
          <h2>Find os</h2>
          <p>
            Gratissimo
            <br />
            Aarhus, Danmark
          </p>
          <p>kontakt@gratissimo.dk</p>
          <div className="social-links" aria-label="Sociale medier">
            <a href="#linkedin" aria-label="LinkedIn">
              in
            </a>
            <a href="#facebook" aria-label="Facebook">
              f
            </a>
            <a href="#instagram" aria-label="Instagram">
              ig
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
