import { useState, useEffect } from "react";
import { Location } from "../constants/locations";

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  maxWindSpeed: number;
  dominantWindDir: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

export function useWeather(location: Location | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        const url = [
          `https://api.open-meteo.com/v1/forecast`,
          `?latitude=${location.lat}&longitude=${location.lon}`,
          `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,`,
          `winddirection_10m,relativehumidity_2m,precipitation,is_day`,
          `&hourly=temperature_2m,weathercode,windspeed_10m,precipitation`,
          `&daily=weathercode,temperature_2m_max,temperature_2m_min,`,
          `precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,`,
          `sunrise,sunset`,
          `&wind_speed_unit=ms`,
          `&timezone=Atlantic%2FReykjavik`,
          `&forecast_days=7`,
          `&forecast_hours=24`,
        ].join("");

        const res = await globalThis.fetch(url);
        if (!res.ok) throw new Error("Villa við að sækja veðurgögn");
        const json = await res.json();

        if (cancelled) return;

        const weather: WeatherData = {
          current: {
            temperature: json.current.temperature_2m,
            apparentTemperature: json.current.apparent_temperature,
            weatherCode: json.current.weathercode,
            windSpeed: json.current.windspeed_10m,
            windDirection: json.current.winddirection_10m,
            humidity: json.current.relativehumidity_2m,
            precipitation: json.current.precipitation,
            isDay: json.current.is_day === 1,
          },
          daily: json.daily.time.map((date: string, i: number) => ({
            date,
            weatherCode: json.daily.weathercode[i],
            maxTemp: json.daily.temperature_2m_max[i],
            minTemp: json.daily.temperature_2m_min[i],
            precipitation: json.daily.precipitation_sum[i],
            maxWindSpeed: json.daily.windspeed_10m_max[i],
            dominantWindDir: json.daily.winddirection_10m_dominant[i],
            sunrise: json.daily.sunrise[i],
            sunset: json.daily.sunset[i],
          })),
          hourly: json.hourly.time.map((time: string, i: number) => ({
            time,
            temperature: json.hourly.temperature_2m[i],
            weatherCode: json.hourly.weathercode[i],
            windSpeed: json.hourly.windspeed_10m[i],
            precipitation: json.hourly.precipitation[i],
          })),
        };

        setData(weather);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Óþekkt villa");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [location?.lat, location?.lon]);

  return { data, loading, error };
}
