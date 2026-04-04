import type { IParaListItem } from "@/types/quran";

type QuranParaConstant = {
  id: IParaListItem["number"];
  name: IParaListItem["englishName"];
  arabic: IParaListItem["arabicName"];
};

export const QURAN_PARAS: QuranParaConstant[] = [
  { id: 1, name: "Alif Lam Meem", arabic: "آلم" },
  { id: 2, name: "Sayaqool", arabic: "سَيَقُولُ" },
  { id: 3, name: "Tilkal Rusulu", arabic: "تِلْكَ ٱلْرُّسُلُ" },
  { id: 4, name: "Lan Tanaloo", arabic: "لَنْ تَنَالُوْا" },
  { id: 5, name: "Wal Muhsanatu", arabic: "وَٱلْمُحْصَنَاتُ" },
  { id: 6, name: "La Yuhibbullah", arabic: "لَا يُحِبُّ ٱللهُ" },
  { id: 7, name: "Wa Iz Samiu", arabic: "وَإِذَا سَمِعُوا" },
  { id: 8, name: "Walau Annana", arabic: "وَلَوْ أَنَّنَا" },
  { id: 9, name: "Qalal Malao", arabic: "قَالَ ٱلْمَلَأُ" },
  { id: 10, name: "Wa'lamu", arabic: "وَٱعْلَمُوا" },
  { id: 11, name: "Ya'tadhiruun", arabic: "يَعْتَذِرُونَ" },
  { id: 12, name: "Wa Ma Min Daabbatin", arabic: "وَمَا مِنْ دَابَّةٍ" },
  { id: 13, name: "Wa Ma Ubabrioo", arabic: "وَمَا أُبَرِّئُ" },
  { id: 14, name: "Rubama", arabic: "رُبَمَا" },
  { id: 15, name: "Subhanalladhi", arabic: "سُبْحَانَ ٱلَّذِى" },
  { id: 16, name: "Qala Alam", arabic: "قَالَ أَلَمْ" },
  { id: 17, name: "Aqtaraba", arabic: "ٱقْتَرَبَ لِلنَّاسِ" },
  { id: 18, name: "Qad Aflaha", arabic: "قَدْ أَفْلَحَ" },
  { id: 19, name: "Wa Qalalladhina", arabic: "وَقَالَ ٱلَّذِينَ" },
  { id: 20, name: "Aman Khalaqa", arabic: "أَمَّنْ خَلَقَ" },
  { id: 21, name: "Utlu Ma Uhiya", arabic: "ٱتْلُ مَا أُوحِيَ" },
  { id: 22, name: "Wa Manyaqnut", arabic: "وَمَنْ يَقْنُتْ" },
  { id: 23, name: "Wa Mali", arabic: "وَمَا لِيَ" },
  { id: 24, name: "Faman Azlamu", arabic: "فَمَنْ أَظْلَمُ" },
  { id: 25, name: "Ilaihi Yuraddu", arabic: "إِلَيْهِ يُرَدُّ" },
  { id: 26, name: "Ha Meem", arabic: "حم" },
  { id: 27, name: "Qala Fama Khatbukum", arabic: "قَالَ فَمَا خَطْبُكُمْ" },
  { id: 28, name: "Qad Sami' Allah", arabic: "قَدْ سَمِعَ ٱللهُ" },
  { id: 29, name: "Tabarakalladhi", arabic: "تَبَارَكَ ٱلَّذِى" },
  { id: 30, name: "Amma", arabic: "عَمَّ" },
];
