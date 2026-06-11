import { useState, useEffect, useCallback } from "react";

export interface IMOAlert {
  id: string;
  title: string;
  description: string;
  severity: "Minor" | "Moderate" | "Severe" | "Extreme";
  event: string;
  areas: string[];
  onset: string;
  expires: string;
}

// Severity colours matching Él palette
export const SEVERITY_COLORS: Record<IMOAlert["severity"], string> = {
  Minor:    "#FFD84D",
  Moderate: "#FF9A3C",
  Severe:   "#FF5C3C",
  Extreme:  "#FF2C2C",
};

export const SEVERITY_LABELS: Record<IMOAlert["severity"], string> = {
  Minor:    "Gult",
  Moderate: "Appelsínugult",
  Severe:   "Rautt",
  Extreme:  "Fjólublátt",
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<IMOAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // IMO public alerts RSS/JSON endpoint
      const res = await fetch(
        "https://api.vedur.is/cap/v1/is/alerts.json"
      );

      if (!res.ok) throw new Error("Gat ekki sótt viðvaranir");
      const json = await res.json();

      // Parse CAP-style JSON from IMO
      const parsed: IMOAlert[] = (json.features ?? []).map((f: any) => {
        const p = f.properties ?? {};
        const info = p.info?.[0] ?? {};
        return {
          id: p.identifier ?? Math.random().toString(),
          title: info.headline ?? "Veðurviðvörun",
          description: info.description ?? "",
          severity: info.severity ?? "Minor",
          event: info.event ?? "",
          areas: (info.area ?? []).map((a: any) => a.areaDesc ?? ""),
          onset: info.onset ?? "",
          expires: info.expires ?? "",
        };
      });

      setAlerts(parsed);
    } catch (e: any) {
      // IMO API might have CORS issues in dev – fail silently, show empty
      setAlerts([]);
      setError(null); // Don't surface this to user, alerts are supplementary
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Refresh every 10 minutes
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return { alerts, loading, error, refresh: fetchAlerts };
}
