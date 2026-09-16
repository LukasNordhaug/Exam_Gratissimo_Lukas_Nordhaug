"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobSearch, Option } from "@/components/home/JobSearch";
import {
  ApiError,
  getJobCategories,
  getJobListings,
  getRegions,
  getWorkTypes,
  isAuthenticated,
  saveFavorite,
} from "@/services/api";

type RecordValue = Record<string, unknown>;

const PAGE_SIZE = 5;
const PAGINATION_WINDOW = 8;

const text = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const idOf = (value: unknown) => Number(value);

const related = (job: RecordValue, key: string) => {
  const value = job[key];
  return value && typeof value === "object"
    ? (value as RecordValue)
    : undefined;
};

const toOption = (item: unknown, labelKeys: string[]): Option | null => {
  if (!item || typeof item !== "object") return null;
  const record = item as RecordValue;
  const id = idOf(record.id);
  const label = labelKeys.map((key) => text(record[key])).find(Boolean);
  return id && label ? { id, label } : null;
};

type SearchParamsLike = {
  get: (key: string) => string | null;
};

const getFilters = (searchParams: SearchParamsLike) => ({
  search: searchParams.get("search") ?? "",
  regionId: searchParams.get("regionId") ?? "",
  jobCategoryId: searchParams.get("jobCategoryId") ?? "",
  workTypeId: searchParams.get("workTypeId") ?? "",
  period: searchParams.get("period") ?? "",
  workHome: searchParams.get("workHome") ?? "",
});

const matchesPeriod = (createdAt: unknown, period: string) => {
  if (!period) return true;
  const date = new Date(text(createdAt));
  if (Number.isNaN(date.getTime())) return false;
  const days = period === "week" ? 7 : period === "month" ? 30 : 365;
  return date.getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
};

export function JobsResults() {
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const filters = getFilters(searchParams);
  const [regions, setRegions] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [workTypes, setWorkTypes] = useState<Option[]>([]);
  const [jobs, setJobs] = useState<RecordValue[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [openJob, setOpenJob] = useState<RecordValue | null>(null);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [savingFavorite, setSavingFavorite] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [regionData, categoryData, workTypeData, jobData] =
          await Promise.all([
            getRegions(),
            getJobCategories(),
            getWorkTypes(),
            getJobListings(),
          ]);
        if (!active) return;
        setRegions(
          regionData
            .map((item) => toOption(item, ["name", "title"]))
            .filter(Boolean) as Option[],
        );
        setCategories(
          categoryData
            .map((item) => toOption(item, ["name", "title"]))
            .filter(Boolean) as Option[],
        );
        setWorkTypes(
          workTypeData
            .map((item) => toOption(item, ["type", "name", "title"]))
            .filter(Boolean) as Option[],
        );
        setJobs(
          jobData.filter((item): item is RecordValue =>
            Boolean(item && typeof item === "object"),
          ),
        );
      } catch {
        if (active) setLoadError("Jobannoncerne kunne ikke hentes lige nu.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadData();
    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const search = filters.search.trim().toLowerCase();
    const searchable = [
      job.title,
      job.description,
      job.organization,
      job.city,
      job.address,
    ]
      .map((value) => text(value).toLowerCase())
      .join(" ");
    const regionId = idOf(related(job, "region")?.id ?? job.regionId);
    const categoryId = idOf(
      related(job, "jobCategory")?.id ?? job.jobCategoryId,
    );
    const workTypeId = idOf(related(job, "workType")?.id ?? job.workTypeId);
    return (
      (!search || searchable.includes(search)) &&
      (!filters.regionId || regionId === idOf(filters.regionId)) &&
      (!filters.jobCategoryId || categoryId === idOf(filters.jobCategoryId)) &&
      (!filters.workTypeId || workTypeId === idOf(filters.workTypeId)) &&
      (!filters.workHome || text(job.workHome) === filters.workHome) &&
      matchesPeriod(job.createdAt, filters.period)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleJobs = filteredJobs.slice(
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

  const handleFavorite = async (jobId: number) => {
    setFavoriteMessage("");
    if (!isAuthenticated()) {
      setLoginPrompt(true);
      return;
    }
    setSavingFavorite(jobId);
    try {
      await saveFavorite(jobId);
      setFavoriteMessage("Annoncen er gemt på din profil.");
    } catch (cause) {
      setFavoriteMessage(
        cause instanceof ApiError
          ? cause.message
          : "Annoncen kunne ikke gemmes.",
      );
    } finally {
      setSavingFavorite(null);
    }
  };

  return (
    <div className="jobs-page">
      <section className="jobs-search-section">
        <div className="layout-container">
          <p className="eyebrow">Søgeresultater</p>
          <h1>Find frivilligt arbejde</h1>
          <JobSearch
            key={queryKey}
            regions={regions}
            categories={categories}
            workTypes={workTypes}
            initialFilters={filters}
          />
        </div>
      </section>

      <section className="jobs-results-section layout-container">
        <div className="jobs-results-heading">
          <div>
            <p className="eyebrow">Muligheder for dig</p>
            <h2>{filteredJobs.length} jobannoncer fundet</h2>
          </div>
          {favoriteMessage && (
            <p className="favorite-message" role="status">
              {favoriteMessage}
            </p>
          )}
        </div>
        {loading ? (
          <p className="data-state">Henter jobannoncer...</p>
        ) : loadError ? (
          <p className="data-state data-state--error">{loadError}</p>
        ) : visibleJobs.length === 0 ? (
          <p className="data-state">Der blev ikke fundet nogen jobannoncer.</p>
        ) : (
          <div className="jobs-list">
            {visibleJobs.map((job) => {
              const jobId = idOf(job.id);
              const region = related(job, "region");
              const workType = related(job, "workType");
              return (
                <article
                  className={`job-result-card${openJob?.id === job.id ? " is-expanded" : ""}`}
                  key={jobId}
                >
                  <div className="job-result-card__main">
                    <p className="job-result-card__meta">
                      {text(job.organization, "Organisation")} ·{" "}
                      {text(
                        related(job, "jobCategory")?.name,
                        "Frivilligt arbejde",
                      )}
                    </p>
                    <h3>{text(job.title, "Jobannonce")}</h3>
                    {openJob?.id === job.id ? (
                      <>
                        <h4>Beskrivelse</h4>
                        <p className="job-result-card__description job-result-card__description--expanded">
                          {text(job.description)}
                        </p>
                        <h4>Erfaring</h4>
                        <p className="job-result-card__description">
                          {text(job.experience, text(job.description))}
                        </p>
                        <h4>Arbejdsopgaver</h4>
                        <p className="job-result-card__description">
                          {text(job.tasks, text(job.description))}
                        </p>
                      </>
                    ) : (
                      <p className="job-result-card__description">
                        {text(job.description).slice(0, 180)}
                        {text(job.description).length > 180 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <div className="job-result-card__details">
                    <p>
                      <strong>Region:</strong> {text(region?.name, "-")}
                    </p>
                    <p>
                      <strong>By:</strong> {text(job.city, "-")}
                    </p>
                    <p>
                      <strong>Arbejdstype:</strong>{" "}
                      {text(workType?.type, text(job.workHome, "-"))}
                    </p>
                    {openJob?.id === job.id && (
                      <div className="job-result-card__contact">
                        <h4>Kontakt</h4>
                        <p>
                          {text(
                            job.contactName,
                            text(job.organization, "Organisation"),
                          )}
                        </p>
                        <p>
                          {text(
                            job.contactPhone,
                            "Kontaktoplysninger findes hos organisationen",
                          )}
                        </p>
                        <p>{text(job.contactEmail, "")}</p>
                      </div>
                    )}
                    <div className="job-result-card__actions">
                      <button
                        type="button"
                        className="job-save-button"
                        onClick={() => void handleFavorite(jobId)}
                        disabled={savingFavorite === jobId}
                      >
                        {savingFavorite === jobId ? (
                          "Gemmer..."
                        ) : (
                          <>
                            Gem{" "}
                            <Image
                              className="job-save-button__heart"
                              src="/icons/icons8-favorite-50.png"
                              alt=""
                              width={14}
                              height={14}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="job-open-button"
                        onClick={() =>
                          setOpenJob(openJob?.id === job.id ? null : job)
                        }
                      >
                        {openJob?.id === job.id ? "Luk" : "Åben"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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
      </section>

      {loginPrompt && (
        <div
          className="login-modal-backdrop"
          role="presentation"
          onClick={() => setLoginPrompt(false)}
        >
          <div
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="login-modal__close"
              type="button"
              onClick={() => setLoginPrompt(false)}
              aria-label="Luk"
            >
              ×
            </button>
            <p className="eyebrow">Gem jobannonce</p>
            <h2 id="login-modal-title">Log ind for at gemme</h2>
            <p>
              Du skal være logget ind, før du kan gemme en jobannonce på din
              profil.
            </p>
            <Link className="button button--small" href="/login">
              Gå til login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
