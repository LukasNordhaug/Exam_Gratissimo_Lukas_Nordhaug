"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/services/api";

const links = [
  { href: "/jobs", label: "Alle Jobs" },
  { href: "/opret-annonce", label: "Opret annonce" },
  { href: "/nyheder", label: "Nyheder" },
];

export function Navigation() {
  const pathname = usePathname();
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
      <div className="site-nav__brand-row">
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
          <Image
            className="brand__logo"
            src="/logo/logo-white.png"
            alt="Gratissimo"
            width={190}
            height={50}
            priority
          />
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
      </div>

      <div
        id="main-menu"
        className={`site-nav__menu-row${menuOpen ? " is-open" : ""}`}
      >
        <div className="site-nav__inner">
          <div className="site-nav__menu">
            <div className="site-nav__links">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? "is-active" : ""}
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
      </div>
    </nav>
  );
}
