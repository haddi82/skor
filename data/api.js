const API_KEY = '95c658499c779d22042a924ae8610a0a';
const BASE_URL = 'https://v3.football.api-sports.io';

export const DEILDIR = {
  urvalsdeildin: { id: 164, nafn: 'Úrvalsdeild', land: '🇮🇸' },
  eitt: { id: 165, nafn: '1. Deild', land: '🇮🇸' },
  tvö: { id: 166, nafn: '2. Deild', land: '🇮🇸' },
  bikar: { id: 167, nafn: 'Bikarinn', land: '🇮🇸' },
  women: { id: 671, nafn: 'Úrvalsdeild W', land: '🇮🇸' },
};

export async function sækjaLeiki(leagueId, season = 2025) {
  const res = await fetch(`${BASE_URL}/fixtures?league=${leagueId}&season=${season}`, {
    headers: { 'x-apisports-key': API_KEY }
  });
  const data = await res.json();
  return data.response;
}

export async function sækjaStigatoflu(leagueId, season = 2025) {
  const res = await fetch(`${BASE_URL}/standings?league=${leagueId}&season=${season}`, {
    headers: { 'x-apisports-key': API_KEY }
  });
  const data = await res.json();
  return data.response[0]?.league?.standings[0] || [];
}

export async function sækjaLeikinn(fixtureId) {
  const res = await fetch(`${BASE_URL}/fixtures?id=${fixtureId}`, {
    headers: { 'x-apisports-key': API_KEY }
  });
  const data = await res.json();
  return data.response[0];
}

export async function sækjaAtburði(fixtureId) {
  const res = await fetch(`${BASE_URL}/fixtures/events?fixture=${fixtureId}`, {
    headers: { 'x-apisports-key': API_KEY }
  });
  const data = await res.json();
  return data.response;
}

export async function sækjaTölfræði(fixtureId) {
  const res = await fetch(`${BASE_URL}/fixtures/statistics?fixture=${fixtureId}`, {
    headers: { 'x-apisports-key': API_KEY }
  });
  const data = await res.json();
  return data.response;
}