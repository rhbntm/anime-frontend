import React from "react";

function AnimeList({ animes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
      {animes.map((anime) => (
        <div
          key={anime.mal_id}
          className="bg-neutral-800 p-4 rounded-lg shadow flex flex-col items-center w-full max-w-xs"
        >
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-40 h-56 object-cover rounded mb-3"
          />
          <div className="text-center">
            <div className="font-semibold">{anime.title}</div>
            <div className="text-sm text-neutral-400">
              Episodes: {anime.episodes ?? "?"}
            </div>
            {anime.score && (
              <div className="text-sm text-yellow-400">Score: {anime.score}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


export default AnimeList;
