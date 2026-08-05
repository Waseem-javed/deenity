<div align="center">

<img src="./assets/images/icon.png" width="96" height="96" alt="Deenity icon" />

# Deenity

**A modern, all‑in‑one Islamic companion app — built with Expo & React Native.**

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-005A5A?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-1ba894?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-0f8478?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-6de3cc?style=for-the-badge)](#contributing)

</div>

<br />

<div align="center">
<table>
<tr><td>

```
██████╗ ███████╗███████╗███╗   ██╗██╗████████╗██╗   ██╗
██╔══██╗██╔════╝██╔════╝████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
██║  ██║█████╗  █████╗  ██╔██╗ ██║██║   ██║    ╚████╔╝
██║  ██║██╔══╝  ██╔══╝  ██║╚██╗██║██║   ██║     ╚██╔╝
██████╔╝███████╗███████╗██║ ╚████║██║   ██║      ██║
╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝
```

</td></tr>
</table>
</div>

## About

Deenity is a free, open-source Islamic app designed to be a single, reliable companion for everyday practice — offline-first where it matters, clean where it counts.

- 📖 **Quran** — offline reader in the 16-line Indopak Mushaf layout, verse-by-verse
- 🕌 **Prayer Times** — accurate, location-based prayer times with Azan audio playback
- 🧭 **Qibla Compass** — real-time direction finder with alignment alerts
- 📿 **99 Names of Allah** (Asma-ul-Husna) — with meanings
- 🙏 **Duas** — categorized collection of daily duas
- 📚 **Hadith** — browse collections by book/chapter
- 🔤 **Tajweed** — rules and guided reading para-by-para
- 🕋 **Islamic Names** — searchable name directory
- 💰 **Zakat Calculator** — quick, correct zakat calculation
- 🌓 **Light & Dark Mode** — automatic, system-aware theming
- 📴 **Offline-First** — core content works without a connection

## Tech Stack

| Layer                 | Technology                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Framework             | [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing) |
| UI                    | React Native, [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for RN), react-native-paper         |
| Language              | TypeScript                                                                                                |
| Prayer & Qibla        | [adhan](https://github.com/batoulapps/adhan-js), expo-location                                            |
| Audio & Notifications | expo-audio, expo-notifications                                                                            |
| Data                  | Quran Foundation API, ummahapi.com                                                                        |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm
- The [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS simulator
- A `.env` file in the project root with the required API keys (ask a maintainer, or see `app.json` / `src/lib` for the variables the app expects)

### Installation

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/deenity.git
cd deenity

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npm start
```

From the Expo CLI output you can open the app on:

- 📱 **Expo Go** — scan the QR code
- 🤖 **Android emulator** — press `a`, or run `npm run android`
- 🍎 **iOS simulator** — press `i`, or run `npm run ios`
- 🌐 **Web** — press `w`, or run `npm run web`

### Useful scripts

```bash
npm start          # Start the Expo dev server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on Web
npm run lint        # Lint the project
```

## Contributing

Deenity is public and open to contributions from anyone — whether that's a new feature, a bug fix, a translation, or a UI polish. 🎉

1. **Fork** the repository and clone your fork locally.
2. **Create a feature branch** off `main` using the convention below — never commit directly to `main`:

   ```bash
   git checkout -b feature/short-description   # new feature
   git checkout -b fix/short-description        # bug fix
   git checkout -b chore/short-description       # tooling, docs, refactors
   ```

   Examples: `feature/hadith-bookmarks`, `fix/qibla-compass-drift`, `chore/update-readme`

3. **Make your changes**, keeping commits focused and messages descriptive.
4. **Run lint** before pushing:

   ```bash
   npm run lint
   ```

5. **Push your branch** and **open a Pull Request** against `main`, describing what changed and why.
6. One of the maintainers will review, suggest changes if needed, and merge. 🚀

If you're planning a larger change, please open an issue first to discuss the approach.

<div align="center">

Made By <kbd>Sunday Code AI</kbd> with 🤍 for the Ummah Community.

</div>
