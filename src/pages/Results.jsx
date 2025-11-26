import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchAnime } from "../services/animeApi";
import AnimeList from "../components/AnimeList";

export default function Results() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const page = Number(params.get("page") || 1);

  const { data: results = [], isLoading, isError } = useQuery({
    queryKey: ["search", q, page],
    queryFn: () => searchAnime(q, page),
    enabled: q.length > 0,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Results for: {q}</h1>
      {q.length === 0 && <p className="text-neutral-400">Enter a search term.</p>}
      {isLoading && <p className="text-neutral-400">Loading...</p>}
      {isError && <p className="text-red-400">Failed to fetch results.</p>}
      {!isLoading && !isError && q && <AnimeList animes={results} />}
    </div>
  );
}


