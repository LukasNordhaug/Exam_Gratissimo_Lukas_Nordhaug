"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CallToActionHeader } from "@/components/layout/CallToActionHeader";
import {
  getArticles,
  getJobCategories,
  getJobListings,
  getRegions,
  getTestimonies,
  getWorkTypes,
} from "@/services/api";

type RecordValue = Record<string, unknown>;

type Option = {
  id: number;
  label: string;
};

type FilterState = {
  search: string;
  regionId: string;
  jobCategoryId: string;
  workTypeId: string;
  period: string;
  workHome: string;
};

const emptyFilters: FilterState = {
  search: "",
  regionId: "",
  jobCategoryId: "",
  workTypeId: "",
  period: "",
  workHome: "",
};

const text = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const idOf = (value: unknown) => Number(value);

const toOption = (item: unknown, labelKeys: string[]): Option | null => {
  if (!item || typeof item !== "object") return null;
  const record = item as RecordValue;
  const id = idOf(record.id);
  const label = labelKeys.map((key) => text(record[key])).find(Boolean);
  return id && label ? { id, label } : null;
};

const related = (job: RecordValue, key: string) => {
  const value = job[key];
  return value && typeof value === "object" ? (value as RecordValue) : undefined;
};

const makeQuery = (filters: FilterState) => {
  const query = new URLSearchParams();
  if (filters.search.trim()) query.set("search", filters.search.trim());
  if (filters.regionId) query.set("regionId", filters.regionId);
  if (filters.jobCategoryId) query.set("jobCategoryId", filters.jobCategoryId);
  if (filters.workTypeId) query.set("workTypeId", filters.workTypeId);
  if (filters.period) query.set("period", filters.period);
  if (filters.workHome) query.set("workHome", filters.workHome);
  return query.toString();
};

export function HomePage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [regions, setRegions] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [workTypes, setWorkTypes] = useState<Option[]>([]);
  const [jobs, setJobs] = useState<RecordValue[]>([]);
  const [articles, setArticles] = useState<RecordValue[]>([]);
  const [testimonies, setTestimonies] = useState<RecordValue[]>([]);
  const [activeTestimony, setActiveTestimony] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const loadHomepageData = async () => {
      try {
        const [regionData, categoryData, workTypeData, jobData, articleData, testimonyData] = await Promise.all([
          getRegions(),
          getJobCategories(),
          getWorkTypes(),
          getJobListings(),
          getArticles(),
          getTestimonies(),
        ]);
        if (!active) return;
        setRegions(regionData.map((item) => toOption(item, ["name", "title"])).filter(Boolean) as Option[]);
        setCategories(categoryData.map((item) => toOption(item, ["name", "title"])).filter(Boolean) as Option[]);
        setWorkTypes(workTypeData.map((item) => toOption(item, ["type", "name", "title"])).filter(Boolean) as Option[]);
        setJobs(jobData.filter((item): item is RecordValue => Boolean(item && typeof item === "object")));
        setArticles(articleData.filter((item): item is RecordValue => Boolean(item && typeof item === "object")).sort(() => Math.random() - .5).slice(0, 3));
        setTestimonies(testimonyData.filter((item): item is RecordValue => Boolean(item && typeof item === "object")));
      } catch {
        if (active) setLoadError("Indholdet kunne ikke hentes lige nu. Prøv igen senere.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadHomepageData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (testimonies.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveTestimony((current) => (current + 1) % testimonies.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [testimonies.length]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = makeQuery(filters);
    router.push(`/jobs${query ? `?${query}` : ""}`);
  };

  const categoryCount = (categoryId: number) =>
    jobs.filter((job) => idOf(related(job, "jobCategory")?.id ?? job.jobCategoryId) === categoryId).length;

  return (
    <div className="home-page">
      <CallToActionHeader />
      <section className="home-search-section">
        <div className="layout-container">
          <p className="eyebrow">Find dit næste frivillige job</p>
          <h1>Søg frivilligt arbejde:</h1>
          <form className="job-search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="job-search">Søg i jobannoncer</label>
            <span className="job-search__icon" aria-hidden="true">⌕</span>
            <input
              id="job-search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Eks. cafémedhjælper..."
            />
            <button type="submit">Søg</button>
          </form>
          <div className="filter-row" aria-label="Filtrer jobannoncer">
            <span className="filter-label">Filtrer:</span>
            <select value={filters.regionId} onChange={(event) => updateFilter("regionId", event.target.value)} aria-label="Geografi">
              <option value="">Geografi</option>
              {regions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <select value={filters.jobCategoryId} onChange={(event) => updateFilter("jobCategoryId", event.target.value)} aria-label="Job kategori">
              <option value="">Job kategori</option>
              {categories.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <select value={filters.workTypeId} onChange={(event) => updateFilter("workTypeId", event.target.value)} aria-label="Arbejdstid">
              <option value="">Arbejdstid</option>
              {workTypes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <select value={filters.period} onChange={(event) => updateFilter("period", event.target.value)} aria-label="Periode">
              <option value="">Periode</option>
              <option value="week">Seneste uge</option>
              <option value="month">Seneste måned</option>
              <option value="year">Seneste år</option>
            </select>
            <select value={filters.workHome} onChange={(event) => updateFilter("workHome", event.target.value)} aria-label="Hjemmearbejde">
              <option value="">Hjemmearbejde</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <button className="filter-reset" type="button" onClick={() => setFilters(emptyFilters)}>Nulstil</button>
          </div>
        </div>
      </section>

      <section className="category-section layout-container">
        <div className="section-heading"><p className="eyebrow">Udforsk muligheder</p><h2>Find job ved kategori</h2></div>
        {loading ? <p className="data-state">Henter kategorier...</p> : loadError ? <p className="data-state data-state--error">{loadError}</p> : (
          <div className="category-grid">
            {categories.map((category) => (
              <Link className="category-card" key={category.id} href={`/jobs?jobCategoryId=${category.id}`}>
                <span>{category.label}</span><strong>{categoryCount(category.id)}</strong>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="news-section">
        <div className="layout-container">
          <div className="section-heading"><p className="eyebrow">Læs med</p><h2>Udvalgte nyheder</h2></div>
          <div className="news-grid">
            {articles.map((article, index) => (
              <Link className="news-card" href={`/nyheder/${article.id}`} key={text(article.id, String(index))}>
                <div className={`news-card__image news-card__image--${index + 1}`} style={article.imageUrl ? { backgroundImage: `url(${text(article.imageUrl)})` } : undefined} />
                <div className="news-card__body">
                  <small>{text(article.author, "Gratissimo")}</small>
                  <h3>{text(article.title, "Nyhed fra Gratissimo")}</h3>
                  <p>{text(article.content).slice(0, 105)}{text(article.content).length > 105 ? "..." : ""}</p>
                </div>
              </Link>
            ))}
            {!loading && articles.length === 0 && <p className="data-state">Der er ingen nyheder endnu.</p>}
          </div>
        </div>
      </section>

      <section className="testimony-section" aria-label="Bruger-anmeldelser">
        <div className="layout-container">
          <p className="eyebrow">Det siger vores brugere</p>
          {testimonies.length > 0 ? (
            <div className="testimony-slider" aria-live="polite">
              <p className="testimony-slider__quote">&ldquo;{text(testimonies[activeTestimony]?.content)}&rdquo;</p>
              <p className="testimony-slider__name">{text(testimonies[activeTestimony]?.name)}</p>
              <p className="testimony-slider__title">{text(testimonies[activeTestimony]?.title)}</p>
              <div className="slider-dots" aria-label="Vælg anmeldelse">
                {testimonies.map((testimony, index) => <button className={index === activeTestimony ? "is-active" : ""} key={text(testimony.id, String(index))} type="button" aria-label={`Vis anmeldelse ${index + 1}`} onClick={() => setActiveTestimony(index)} />)}
              </div>
            </div>
          ) : <p className="data-state">Der er ingen anmeldelser endnu.</p>}
        </div>
      </section>
    </div>
  );
}
