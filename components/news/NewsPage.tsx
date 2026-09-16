"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiAssetUrl, getArticles } from "@/services/api";

type RecordValue = Record<string, unknown>;

type NewsPageProps = {
  initialId?: string;
};

const text = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const articleDate = (article: RecordValue) => {
  const date = new Date(text(article.createdAt));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
};

const idOf = (value: unknown) => Number(value);

const articleImage = (article: RecordValue) => getApiAssetUrl(article.imageUrl);

export function NewsPage({ initialId }: NewsPageProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<RecordValue[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<RecordValue | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadArticles = async () => {
      try {
        const data = await getArticles();
        const validArticles = data.filter((item): item is RecordValue =>
          Boolean(item && typeof item === "object"),
        );
        if (!active) return;
        setArticles(validArticles);
        const requestedArticle = validArticles.find(
          (article) => idOf(article.id) === idOf(initialId),
        );
        setSelectedArticle(
          requestedArticle ??
            validArticles[Math.floor(Math.random() * validArticles.length)] ??
            null,
        );
      } catch {
        if (active) setError("Nyhederne kunne ikke hentes lige nu.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadArticles();
    return () => {
      active = false;
    };
  }, [initialId]);

  const selectArticle = (article: RecordValue) => {
    setSelectedArticle(article);
    router.replace(`/nyheder/${idOf(article.id)}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return <p className="data-state news-page-state">Henter nyheder...</p>;
  if (error)
    return (
      <p className="data-state data-state--error news-page-state">{error}</p>
    );
  if (!selectedArticle)
    return (
      <p className="data-state news-page-state">Der er ingen nyheder endnu.</p>
    );

  const selectedImage = articleImage(selectedArticle);

  return (
    <main className="news-page">
      <section className="selected-news-section">
        <div className="layout-container">
          <p className="eyebrow">Udvalgt nyhed</p>
          <article className="selected-news">
            <div
              className="selected-news__image"
              style={
                selectedImage
                  ? { backgroundImage: `url(${selectedImage})` }
                  : undefined
              }
            />
            <div className="selected-news__content">
              <h1>{text(selectedArticle.title, "Nyhed fra Gratissimo")}</h1>
              <small>
                {text(selectedArticle.author, "Gratissimo")}
                {articleDate(selectedArticle)
                  ? ` · ${articleDate(selectedArticle)}`
                  : ""}
              </small>
              <p>{text(selectedArticle.content)}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="all-news-section">
        <div className="layout-container">
          <div className="section-heading">
            <p className="eyebrow">Læs med</p>
            <h2>Alle nyheder</h2>
          </div>
          <div className="all-news-grid">
            {articles.map((article) => {
              const articleId = idOf(article.id);
              const image = articleImage(article);
              return (
                <button
                  className={`all-news-card${articleId === idOf(selectedArticle.id) ? " is-selected" : ""}`}
                  key={articleId}
                  type="button"
                  onClick={() => selectArticle(article)}
                >
                  <div
                    className="all-news-card__image"
                    style={
                      image ? { backgroundImage: `url(${image})` } : undefined
                    }
                  />
                  <span className="all-news-card__body">
                    <small>{text(article.author, "Gratissimo")}</small>
                    <strong>
                      {text(article.title, "Nyhed fra Gratissimo")}
                    </strong>
                    <span>
                      {text(article.content).slice(0, 125)}
                      {text(article.content).length > 125 ? "..." : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
