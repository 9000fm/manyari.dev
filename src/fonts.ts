import {
  Inter_Tight,
  Fraunces,
  Inter,
  Playfair_Display,
  PT_Serif,
  VT323,
  Silkscreen,
  Chivo_Mono,
  JetBrains_Mono,
  Audiowide,
  Space_Grotesk,
  Bricolage_Grotesque,
  Archivo_Black,
  Abril_Fatface,
  Major_Mono_Display,
  IBM_Plex_Mono,
} from "next/font/google";

export const fontInterTight = Inter_Tight({ subsets: ["latin"], display: "swap", weight: ["400", "500", "700", "900"] });
export const fontFraunces   = Fraunces({   subsets: ["latin"], display: "swap", weight: ["400", "700", "900"] });
export const fontInter      = Inter({      subsets: ["latin"], display: "swap", weight: ["400", "500", "700"] });
export const fontPlayfair   = Playfair_Display({ subsets: ["latin"], display: "swap", weight: ["400", "700", "900"] });
export const fontPTSerif    = PT_Serif({   subsets: ["latin"], display: "swap", weight: ["400", "700"] });
export const fontVT323      = VT323({      subsets: ["latin"], display: "swap", weight: ["400"] });
export const fontSilkscreen = Silkscreen({ subsets: ["latin"], display: "swap", weight: ["400", "700"] });
export const fontChivoMono  = Chivo_Mono({ subsets: ["latin"], display: "swap", weight: ["400", "700"] });
export const fontJetBrains  = JetBrains_Mono({ subsets: ["latin"], display: "swap", weight: ["400", "500", "700"] });
export const fontAudiowide  = Audiowide({  subsets: ["latin"], display: "swap", weight: ["400"] });
export const fontSpaceGrotesk     = Space_Grotesk({ subsets: ["latin"], display: "swap", weight: ["400", "500", "700"] });
export const fontBricolage  = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", weight: ["400", "700"] });
export const fontArchivoBlack = Archivo_Black({ subsets: ["latin"], display: "swap", weight: ["400"] });
export const fontAbril      = Abril_Fatface({ subsets: ["latin"], display: "swap", weight: ["400"] });
export const fontMajorMono  = Major_Mono_Display({ subsets: ["latin"], display: "swap", weight: ["400"] });
export const fontIBMPlexMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", weight: ["400", "500", "700"] });
