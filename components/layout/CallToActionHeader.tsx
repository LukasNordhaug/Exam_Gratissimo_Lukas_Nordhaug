import Link from "next/link";

export function CallToActionHeader() {
  return (
    <section className="cta-header" aria-label="Kom i gang">
      <div className="layout-container cta-header__inner">
        <p>Vi hjælper dig på vej til dit næste frivillige job</p>
        <Link className="button button--small" href="/login">
          Log ind eller opret dig
        </Link>
      </div>
    </section>
  );
}
