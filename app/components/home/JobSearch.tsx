"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type Option = {
  id: number;
  label: string;
};

export type FilterState = {
  search: string;
  regionId: string;
  jobCategoryId: string;
  workTypeId: string;
  period: string;
  workHome: string;
};

export const emptyFilters: FilterState = {
  search: "",
  regionId: "",
  jobCategoryId: "",
  workTypeId: "",
  period: "",
  workHome: "",
};

export const makeQuery = (filters: FilterState) => {
  const query = new URLSearchParams();
  if (filters.search.trim()) query.set("search", filters.search.trim());
  if (filters.regionId) query.set("regionId", filters.regionId);
  if (filters.jobCategoryId) query.set("jobCategoryId", filters.jobCategoryId);
  if (filters.workTypeId) query.set("workTypeId", filters.workTypeId);
  if (filters.period) query.set("period", filters.period);
  if (filters.workHome) query.set("workHome", filters.workHome);
  return query.toString();
};

type JobSearchProps = {
  regions: Option[];
  categories: Option[];
  workTypes: Option[];
  initialFilters?: Partial<FilterState>;
};

export function JobSearch({
  regions,
  categories,
  workTypes,
  initialFilters,
}: JobSearchProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    ...initialFilters,
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = makeQuery(filters);
    router.push(`/jobs${query ? `?${query}` : ""}`);
  };

  return (
    <>
      <form className="job-search" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="job-search">
          Søg i jobannoncer
        </label>
        <Image
          className="job-search__icon"
          src="/icons/icons8-search-50.png"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
        />
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
        <select
          value={filters.regionId}
          onChange={(event) => updateFilter("regionId", event.target.value)}
          aria-label="Geografi"
        >
          <option value="">Geografi</option>
          {regions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.jobCategoryId}
          onChange={(event) =>
            updateFilter("jobCategoryId", event.target.value)
          }
          aria-label="Job kategori"
        >
          <option value="">Job kategori</option>
          {categories.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.workTypeId}
          onChange={(event) => updateFilter("workTypeId", event.target.value)}
          aria-label="Arbejdstid"
        >
          <option value="">Arbejdstid</option>
          {workTypes.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.period}
          onChange={(event) => updateFilter("period", event.target.value)}
          aria-label="Periode"
        >
          <option value="">Periode</option>
          <option value="week">Seneste uge</option>
          <option value="month">Seneste måned</option>
          <option value="year">Seneste år</option>
        </select>
        <select
          value={filters.workHome}
          onChange={(event) => updateFilter("workHome", event.target.value)}
          aria-label="Hjemmearbejde"
        >
          <option value="">Hjemmearbejde</option>
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <button
          className="filter-reset"
          type="button"
          onClick={() => setFilters(emptyFilters)}
        >
          Nulstil
        </button>
      </div>
    </>
  );
}
