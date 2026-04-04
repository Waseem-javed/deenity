import { config, QuranInstance } from "@/config";
import {
  ISurah,
  ISurahDetail,
  ISurahDetailResponse,
  ISurahListResponse,
} from "@/types/quran";

export const fetchAllSurahs = async (): Promise<{ data: ISurah[] }> => {
  const response = await QuranInstance.get<ISurahListResponse>("/surah", config);
  return { data: response.data.data };
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

// export const fetchJuzs = async (): Promise<IJuzSummary> => {
//   const juszResponses: IJuzResponse[] = [];
//   for (let i = 1; i <= 30; i++) {
//     const response = await QuranInstance.get(`/juz/${i}`);
//     juszResponses.push(response.data);
//   }
//   return { data: juszResponses };
// };
