"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/services/api";

const links = [
  { href: "/jobs", label: "Alle Jobs" },
  { href: "/opret-annonce", label: "Opret Annonce" },
  { href: "/nyheder", label: "Nyheder" },
];

export function Navigation() {
  const [authenticated, setAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const checkAuth = window.setTimeout(
      () => setAuthenticated(isAuthenticated()),
      0,
    );
    return () => window.clearTimeout(checkAuth);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setAuthenticated(false);
      setMenuOpen(false);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="site-nav" aria-label="Hovednavigation">
      <div className="site-nav__inner">
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            ♥
          </span>
          <span>
            <strong>Gratissimo</strong>
            <small>frivilligt arbejde</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? "Luk menu" : "Åbn menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="main-menu"
          className={`site-nav__menu${menuOpen ? " is-open" : ""}`}
        >
          <div className="site-nav__links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="site-nav__account">
            {authenticated ? (
              <>
                <Link href="/min-side" onClick={() => setMenuOpen(false)}>
                  Min side
                </Link>
                <span className="site-nav__separator">|</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logger ud..." : "Log ud"}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Opret Profil&nbsp; | &nbsp;Log ind
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
