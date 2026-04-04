import { config, QuranInstance } from "@/config";
import {
  IJuzDetail,
  IJuzDetailResponse,
  ISurah,
  ISurahDetail,
  ISurahDetailResponse,
  ISurahListResponse,
} from "@/types/quran";

let surahListCache: ISurah[] | null = null;
let surahListPromise: Promise<{ data: ISurah[] }> | null = null;
const juzDetailCache = new Map<number, IJuzDetail>();
const juzDetailPromiseCache = new Map<number, Promise<IJuzDetail>>();

export const fetchAllSurahs = async (): Promise<{ data: ISurah[] }> => {
  if (surahListCache) {
    return { data: surahListCache };
  }

  if (!surahListPromise) {
    surahListPromise = QuranInstance.get<ISurahListResponse>("/surah", config)
      .then((response) => {
        surahListCache = response.data.data;
        return { data: surahListCache };
      })
      .finally(() => {
        surahListPromise = null;
      });
  }

  return surahListPromise;
};

export const fetchSurahByNumber = async (
  number: number,
): Promise<ISurahDetail> => {
  const response = await QuranInstance.get<ISurahDetailResponse>(
    `/surah/${number}`,
    config,
  );
  return response.data.data;
};

export const fetchJuzByNumber = async (number: number): Promise<IJuzDetail> => {
  const cachedDetail = juzDetailCache.get(number);

  if (cachedDetail) {
    return cachedDetail;
  }

  const pendingDetail = juzDetailPromiseCache.get(number);

  if (pendingDetail) {
    return pendingDetail;
  }

  const request = QuranInstance.get<IJuzDetailResponse>(`/juz/${number}`, config)
    .then((response) => {
      const detail = response.data.data;
      juzDetailCache.set(number, detail);
      return detail;
    })
    .finally(() => {
      juzDetailPromiseCache.delete(number);
    });

  juzDetailPromiseCache.set(number, request);

  return request;
};
