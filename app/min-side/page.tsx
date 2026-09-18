"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteFavorite,
  getCurrentUser,
  getFavorites,
  getJobListings,
  isAuthenticated,
} from "@/services/api";

type RecordValue = Record<string, unknown>;
type Tab = "announcements" | "favorites";

const PAGE_SIZE = 5;
const PAGINATION_WINDOW = 8;

const text = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
const idOf = (value: unknown) => Number(value);
const related = (value: unknown, key: string) =>
  value && typeof value === "object"
    ? ((value as RecordValue)[key] as RecordValue | undefined)
    : undefined;

export default function MyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("announcements");
  const [user, setUser] = useState<RecordValue | null>(null);
  const [announcements, setAnnouncements] = useState<RecordValue[]>([]);
  const [favorites, setFavorites] = useState<RecordValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    let active = true;
    Promise.all([getCurrentUser(), getJobListings(), getFavorites()])
      .then(([users, jobs, favoriteItems]) => {
        if (!active) return;
        const currentUser = users.find((item): item is RecordValue =>
          Boolean(item && typeof item === "object"),
        );
        const userId = idOf(currentUser?.id);
        setUser(currentUser ?? null);
        setAnnouncements(
          jobs.filter((item): item is RecordValue =>
            Boolean(
              item &&
              typeof item === "object" &&
              idOf((item as RecordValue).userId) === userId,
            ),
          ),
        );
        setFavorites(
          favoriteItems.filter((item): item is RecordValue =>
            Boolean(item && typeof item === "object"),
          ),
        );
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof ApiError
              ? cause.message
              : "Din side kunne ikke hentes.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  // Reset to page 1 whenever the active tab changes, since the list changes.
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const removeFavorite = async (favoriteId: number) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((current) =>
        current.filter((favorite) => idOf(favorite.id) !== favoriteId),
      );
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Favoritten kunne ikke fjernes.",
      );
    }
  };

  const renderCard = (item: RecordValue, favorite = false) => {
    const job = favorite ? (item.jobListing as RecordValue | undefined) : item;
    if (!job) return null;
    const favoriteId = idOf(item.id);
    const region = related(job, "region");
    return (
      <article
        className="my-job-card"
        key={favorite ? favoriteId : idOf(job.id)}
      >
        <div className="my-job-card__main">
          <p className="my-job-card__meta">
            {text(job.organization, "Organisation")} / Forening
          </p>
          <h3>{text(job.title, "Jobtitel - Overskrift")}</h3>
          <p>
            {text(job.description).slice(0, 190)}
            {text(job.description).length > 190 ? "..." : ""}
          </p>
        </div>
        <div className="my-job-card__side">
          <p>
            <strong>Lokation:</strong> {text(job.city, text(region?.name, "-"))}
          </p>
          <p>
            <strong>Indrykket d.:</strong> {text(job.createdAt, "22/5-25")}
          </p>
          <div className="my-job-card__actions">
            {favorite ? (
              <button
                type="button"
                onClick={() => void removeFavorite(favoriteId)}
              >
                Fjern
              </button>
            ) : (
              <button type="button">Slet</button>
            )}
            {!favorite && (
              <button type="button" className="is-light">
                Rediger
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  const activeItems = tab === "announcements" ? announcements : favorites;

  const totalPages = Math.max(1, Math.ceil(activeItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = activeItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const paginationStart =
    Math.floor((currentPage - 1) / PAGINATION_WINDOW) * PAGINATION_WINDOW + 1;
  const paginationEnd = Math.min(
    totalPages,
    paginationStart + PAGINATION_WINDOW - 1,
  );
  const paginationPages = Array.from(
    { length: paginationEnd - paginationStart + 1 },
    (_, index) => paginationStart + index,
  );

  return (
    <main className="my-page">
      <section className="my-page__intro">
        <div className="layout-container">
          <h1>Velkommen {text(user?.firstname, "tilbage")}</h1>
          <p>
            Rediger eller slet dine annoncer. Du kan også danne dig et overblik
            over de
            <br />
            annoncer du har gemt som favorit, samt fjerne dem igen.
          </p>
          <div className="my-page__links">
            <Link href="/login">Log ud</Link>
            <Link href="/login">Rediger Profil</Link>
          </div>
        </div>
      </section>
      <section className="my-page__content layout-container">
        <div className="my-page__tabs" role="tablist">
          <button
            className={tab === "announcements" ? "is-active" : ""}
            type="button"
            onClick={() => setTab("announcements")}
          >
            Mine annoncer
          </button>
          <button
            className={tab === "favorites" ? "is-active" : ""}
            type="button"
            onClick={() => setTab("favorites")}
          >
            Mine favoritter
          </button>
        </div>
        {loading ? (
          <p className="data-state">Henter din side...</p>
        ) : error ? (
          <p className="data-state data-state--error">{error}</p>
        ) : (
          <>
            <div className="my-jobs-list">
              {visibleItems.map((item) =>
                renderCard(item, tab === "favorites"),
              )}
              {activeItems.length === 0 && (
                <p className="data-state">Der er ikke noget at vise endnu.</p>
              )}
            </div>
            {activeItems.length > 0 && (
              <nav className="jobs-pagination" aria-label="Sideinddeling">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                  aria-label="Forrige side"
                >
                  <Image
                    src="/icons/icons8-back-30.png"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                </button>
                {paginationPages.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={pageNumber === currentPage ? "is-active" : ""}
                    onClick={() => setPage(pageNumber)}
                    aria-label={`Side ${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Næste side"
                >
                  <Image
                    src="/icons/icons8-forward-30.png"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
