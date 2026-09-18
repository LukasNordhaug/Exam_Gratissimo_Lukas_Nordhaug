"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CallToActionHeader } from "@/app/components/layout/CallToActionHeader";
import {
  ApiError,
  createJobListing,
  getCurrentUser,
  getJobCategories,
  getRegions,
  getWorkTypes,
  isAuthenticated,
} from "@/services/api";

type RecordValue = Record<string, unknown>;
type Option = { id: number; label: string };

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

type Fields = {
  title: string;
  organization: string;
  regionId: string;
  jobCategoryId: string;
  workTypeId: string;
  workHome: string;
  address: string;
  zipcode: string;
  city: string;
  description: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = {
  title: "",
  organization: "",
  regionId: "",
  jobCategoryId: "",
  workTypeId: "",
  workHome: "",
  address: "",
  zipcode: "",
  city: "",
  description: "",
};

const validate = (fields: Fields): Errors => {
  const errors: Errors = {};
  if (!fields.title.trim()) errors.title = "Overskrift er påkrævet.";
  if (!fields.organization.trim()) errors.organization = "Organisation/forening er påkrævet.";
  if (!fields.regionId) errors.regionId = "Vælg en lokation.";
  if (!fields.jobCategoryId) errors.jobCategoryId = "Vælg en kategori.";
  if (!fields.workTypeId) errors.workTypeId = "Vælg en arbejdstid.";
  if (!fields.workHome) errors.workHome = "Vælg om jobbet er on-site, remote eller hybrid.";
  if (!fields.address.trim()) errors.address = "Adresse er påkrævet.";
  if (!fields.zipcode.trim()) errors.zipcode = "Postnummer er påkrævet.";
  else if (!/^\d{4}$/.test(fields.zipcode.trim())) errors.zipcode = "Postnummer skal være 4 cifre.";
  if (!fields.city.trim()) errors.city = "By er påkrævet.";
  if (!fields.description.trim()) errors.description = "Job beskrivelse er påkrævet.";
  else if (fields.description.trim().length < 20) errors.description = "Beskrivelsen skal være mindst 20 tegn.";
  return errors;
};

export default function CreateJobListingPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [regions, setRegions] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [workTypes, setWorkTypes] = useState<Option[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const authed = isAuthenticated();
    setAuthenticated(authed);
    if (!authed) return;
    Promise.all([getRegions(), getJobCategories(), getWorkTypes(), getCurrentUser()])
      .then(([regionData, categoryData, workTypeData, users]) => {
        setRegions(regionData.map((item) => toOption(item, ["name"])).filter(Boolean) as Option[]);
        setCategories(categoryData.map((item) => toOption(item, ["name"])).filter(Boolean) as Option[]);
        setWorkTypes(workTypeData.map((item) => toOption(item, ["type"])).filter(Boolean) as Option[]);
        const currentUser = users.find((item): item is RecordValue => Boolean(item && typeof item === "object"));
        setUserId(currentUser ? idOf(currentUser.id) : null);
      })
      .catch(() => setFormError("Formularens data kunne ikke hentes lige nu."));
  }, []);

  const update = (field: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setFormError("");
    setSuccess(false);
    if (Object.keys(nextErrors).length > 0) return;
    if (!userId) {
      setFormError("Din bruger kunne ikke bekræftes. Prøv at logge ind igen.");
      return;
    }
    setSubmitting(true);
    try {
      await createJobListing({
        title: fields.title.trim(),
        description: fields.description.trim(),
        organization: fields.organization.trim(),
        address: fields.address.trim(),
        zipcode: fields.zipcode.trim(),
        city: fields.city.trim(),
        workHome: fields.workHome,
        regionId: fields.regionId,
        jobCategoryId: fields.jobCategoryId,
        workTypeId: fields.workTypeId,
        userId: String(userId),
      });
      setSuccess(true);
      setFields(emptyFields);
    } catch (cause) {
      setFormError(cause instanceof ApiError ? cause.message : "Annoncen kunne ikke oprettes.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: keyof Fields,
    label: string,
    control: "input" | "select",
    options?: Option[],
  ) => (
    <div className="create-job-field" key={name}>
      <label htmlFor={`job-${name}`}>{label}</label>
      {control === "select" ? (
        <select id={`job-${name}`} value={fields[name]} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])}>
          <option value="">Vælg {label.toLowerCase()}...</option>
          {options?.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input id={`job-${name}`} value={fields[name]} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} />
      )}
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <main className="create-job-page">
      <CallToActionHeader />
      <section className="create-job-intro">
        <div className="layout-container">
          <h1>Opret en annonce og find frivillige til din forening</h1>
          <p>
            Gratissimo er gratis for alle. Frivillige, organisationer og foreninger. Du skaber det
            frivillige liv og vi formidler kontakten. Når du har fundet en frivillig til din forening,
            kan du blot fjerne annoncen igen ved at gå til din side.
          </p>
          <Link href="/min-side">Gå til min side</Link>
        </div>
      </section>

      {authenticated === false && (
        <section className="create-job-blocked layout-container">
          <p className="eyebrow">Log ind krævet</p>
          <h2>Du skal logge ind for at oprette en annonce</h2>
          <p>Log ind eller opret en profil for at kunne oprette jobannoncer på Gratissimo.</p>
          <Link className="button button--small" href="/login">Log ind</Link>
        </section>
      )}

      {authenticated && (
        <section className="create-job-form-section layout-container">
          {success && (
            <p className="create-job-success" role="status">
              Din annonce er nu oprettet.
            </p>
          )}
          {formError && (
            <p className="login-form__error" role="alert">{formError}</p>
          )}
          <form className="create-job-grid" onSubmit={handleSubmit} noValidate>
            <div className="create-job-fields">
              {field("title", "Overskrift", "input")}
              {field("organization", "Organisation/forening", "input")}
              {field("regionId", "Lokation", "select", regions)}
              {field("jobCategoryId", "Kategori", "select", categories)}
              {field("workTypeId", "Arbejdstid", "select", workTypes)}
              <div className="create-job-field">
                <label htmlFor="job-workHome">Hjemmearbejde</label>
                <select id="job-workHome" value={fields.workHome} onChange={(event) => update("workHome", event.target.value)} aria-invalid={Boolean(errors.workHome)}>
                  <option value="">Vælg hjemmearbejde...</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.workHome && <span className="field-error">{errors.workHome}</span>}
              </div>
              {field("address", "Adresse", "input")}
              {field("zipcode", "Postnummer", "input")}
              {field("city", "By", "input")}
            </div>
            <div className="create-job-description">
              <label htmlFor="job-description">Job beskrivelse</label>
              <textarea
                id="job-description"
                value={fields.description}
                onChange={(event) => update("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
                placeholder="Beskriv opgaverne, ansvarsområderne og hvad der forventes af den frivillige..."
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
              <button className="button button--small" type="submit" disabled={submitting}>
                {submitting ? "Opretter..." : "Opret annonce"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
