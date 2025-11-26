import { api } from "./apiClient";

export async function searchAnime(query, page = 1) {
  const res = await api.get(`/anime/search/${encodeURIComponent(query)}`, {
    params: { page },
  });
  return res.data?.data ?? [];
}

export async function getTopAnime(page = 1) {
  const res = await api.get(`/anime/top`, { params: { page } });
  return res.data?.data ?? [];
}

// export async function getTopAnime() {
//   const res = await api.get(`/anime/top`);
//   return res.data?.data ?? [];
// }

export async function getAnimeById(id) {
  const res = await api.get(`/anime/${id}`);
  return res.data?.data ?? null;
}


