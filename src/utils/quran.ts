import { QURAN_PARAS } from "@/constants/quran";
import type { IAyah, IParaListItem, IQuranPageGroup } from "@/types/quran";

export const normalizeRouteParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const groupAyahsByPage = (ayahs: IAyah[]): IQuranPageGroup[] => {
  const pages: Record<number, IAyah[]> = {};

  ayahs.forEach((ayah) => {
    if (!pages[ayah.page]) {
      pages[ayah.page] = [];
    }

    pages[ayah.page].push(ayah);
  });

  return Object.keys(pages)
    .map((pageNumber) => {
      const pageAyahs = pages[Number(pageNumber)];

      return {
        pageNumber: Number(pageNumber),
        juzNumbers: [...new Set(pageAyahs.map((ayah) => ayah.juz))],
        ayahs: pageAyahs,
      };
    })
    .sort((a, b) => a.pageNumber - b.pageNumber);
};

export const formatJuzLabel = (juzNumbers: number[]) =>
  `Juz ${juzNumbers.join(", ")}`;

export const buildParaList = (): IParaListItem[] =>
  QURAN_PARAS.map((para) => ({
    number: para.id,
    englishName: para.name,
    arabicName: para.arabic,
  }));
