import React from "react";
import SearchBar from "../components/SearchBar";
import AnimeList from "../components/AnimeList";
import { useQuery } from "@tanstack/react-query";
import { getTopAnime } from "../services/animeApi";
import bgImage from "../assets/taposnapo.jpg";

export default function Home() {
  const { data: topAnime = [], isLoading, isError } = useQuery({
    queryKey: ["top", 1],
    queryFn: () => getTopAnime(1),
  });

  return (
    <div className="space-y-6 pt-30">
      <section
        className="relative overflow-hidden rounded-xl border border-neutral-800 min-h-[50vh] sm:min-h-[60vh]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="px-6 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Anime Search</h1>
          <p className="text-neutral-200 mb-6 max-w-2xl">
            Find anime by title and browse top series. Start typing below.
          </p>
          <SearchBar />
        </div>
      </section>
      {isLoading && <p className="text-neutral-400">Loading...</p>}
      {isError && <p className="text-red-400">Failed to load top anime.</p>}
      {!isLoading && !isError && (
        <div className="space-y-3">
          <h2 className="text-xl font-medium">Top Anime</h2>
          <AnimeList animes={topAnime} />
        </div>
      )}
    </div>
  );
}


