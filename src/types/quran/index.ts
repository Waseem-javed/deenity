export type QuranTab = "surah" | "para";
export type ISurahType = "Meccan" | "Medinan";

export interface IAyah {
  number: number;
  text: string;
  surah: ISurah;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface ISurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: ISurahType;
}

export interface IEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface IJuzSummary {
  number: number;
  ayahs: IAyah[];
  surahs: Record<number, ISurah>;
  edition: IEdition;
}

export interface IParaListItem {
  number: number;
  arabicName: string;
  englishName: string;
}

export type IJuzDetail = IJuzSummary;
export interface IQuranPageGroup {
  pageNumber: number;
  juzNumbers: number[];
  ayahs: IAyah[];
}

export interface IApiResponse<T> {
  code: number;
  data: T;
  status: string;
}

export interface ISurahDetail extends ISurah {
  edition: IEdition;
  ayahs: IAyah[];
}

export type ISurahListResponse = IApiResponse<ISurah[]>;
export type ISurahDetailResponse = IApiResponse<ISurahDetail>;
export type IJuzDetailResponse = IApiResponse<IJuzDetail>;
