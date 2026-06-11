export interface Location {
  name: string;
  lat: number;
  lon: number;
  region: string;
}

export const LOCATIONS: Location[] = [
  { name: "Reykjavík",     lat: 64.1355, lon: -21.8954, region: "Höfuðborgarsvæði" },
  { name: "Kópavogur",     lat: 64.1122, lon: -21.9128, region: "Höfuðborgarsvæði" },
  { name: "Hafnarfjörður", lat: 64.0667, lon: -21.9333, region: "Höfuðborgarsvæði" },
  { name: "Keflavík",      lat: 63.9850, lon: -22.5561, region: "Suðurnes" },
  { name: "Selfoss",       lat: 63.9333, lon: -20.9667, region: "Suðurland" },
  { name: "Vík",           lat: 63.4186, lon: -18.9989, region: "Suðurland" },
  { name: "Akureyri",      lat: 65.6835, lon: -18.0878, region: "Norðurland" },
  { name: "Húsavík",       lat: 66.0440, lon: -17.3390, region: "Norðurland" },
  { name: "Ísafjörður",    lat: 66.0757, lon: -23.1350, region: "Vestfirðir" },
  { name: "Stykkishólmur", lat: 65.0833, lon: -22.7333, region: "Vesturland" },
  { name: "Egilsstaðir",   lat: 65.2667, lon: -14.3958, region: "Austurland" },
  { name: "Höfn",          lat: 64.2539, lon: -15.2100, region: "Austurland" },
];

export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: "Heiðskýrt",          icon: "☀️" },
  1:  { label: "Að mestu skýlaust",   icon: "🌤️" },
  2:  { label: "Hálfskýjað",          icon: "⛅" },
  3:  { label: "Skýjað",              icon: "☁️" },
  45: { label: "Þoka",                icon: "🌫️" },
  48: { label: "Þoka með ís",         icon: "🌫️" },
  51: { label: "Súlufok",             icon: "🌦️" },
  53: { label: "Súlufok",             icon: "🌦️" },
  55: { label: "Þungt súlufok",       icon: "🌧️" },
  61: { label: "Létt rigning",        icon: "🌧️" },
  63: { label: "Rigning",             icon: "🌧️" },
  65: { label: "Þung rigning",        icon: "🌧️" },
  71: { label: "Létt snjókoma",       icon: "🌨️" },
  73: { label: "Snjókoma",            icon: "❄️" },
  75: { label: "Þung snjókoma",       icon: "❄️" },
  77: { label: "Snjókornaél",         icon: "❄️" },
  80: { label: "Skúrir",              icon: "🌦️" },
  81: { label: "Skúrir",              icon: "🌧️" },
  82: { label: "Þungir skúrir",       icon: "⛈️" },
  85: { label: "Snjóskúrir",          icon: "🌨️" },
  86: { label: "Þungir snjóskúrir",   icon: "❄️" },
  95: { label: "Þrumuveður",          icon: "⛈️" },
  96: { label: "Þrumuveður m. hagli", icon: "⛈️" },
  99: { label: "Þrumuveður m. hagli", icon: "⛈️" },
};

export const DAYS_IS = ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"];
export const MONTHS_IS = ["jan","feb","mar","apr","maí","jún","júl","ágú","sep","okt","nóv","des"];

export const BEAUFORT: { max: number; label: string }[] = [
  { max: 0.2,  label: "Logn" },
  { max: 1.5,  label: "Andvari" },
  { max: 3.3,  label: "Kul" },
  { max: 5.4,  label: "Gola" },
  { max: 7.9,  label: "Stinningsgola" },
  { max: 10.7, label: "Kaldi" },
  { max: 13.8, label: "Stinningskaldi" },
  { max: 17.1, label: "Allhvass" },
  { max: 20.7, label: "Hvass" },
  { max: 24.4, label: "Mjög hvass" },
  { max: 28.4, label: "Stormur" },
  { max: 32.6, label: "Mikill stormur" },
  { max: Infinity, label: "Rok" },
];

export function getBeaufort(ms: number): string {
  return BEAUFORT.find(b => ms <= b.max)?.label ?? "Rok";
}

export function getWindDirection(deg: number): string {
  const dirs = ["N","NA","A","SA","S","SV","V","NV"];
  return dirs[Math.round(deg / 45) % 8];
}
