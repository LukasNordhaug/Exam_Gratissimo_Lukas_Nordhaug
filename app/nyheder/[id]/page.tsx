"use client";

import { useParams } from "next/navigation";
import { NewsPage } from "@/components/news/NewsPage";

export default function NewsArticlePage() {
  const params = useParams<{ id: string }>();
  return <NewsPage initialId={params.id} />;
}
//laver dynamiske nyheder baseret på id