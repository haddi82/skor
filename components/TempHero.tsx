import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CurrentWeather, DailyForecast } from "../hooks/useWeather";
import { WMO_CODES, getBeaufort, getWindDirection } from "../constants/locations";

interface Props {
  current: CurrentWeather;
  today: DailyForecast;
  locationName: string;
  isGPS: boolean;
  accentColor: string;
}

export function TempHero({ current, today, locationName, isGPS, accentColor }: Props) {
  const wmo = WMO_CODES[current.weatherCode] ?? { label: "Óþekkt", icon: "🌡️" };

  return (
    <View style={styles.container}>
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>{isGPS ? "📍" : "📌"}</Text>
        <Text style={styles.locationName}>{locationName}</Text>
      </View>

      <View style={styles.tempRow}>
        <Text style={styles.tempBig}>{Math.round(current.temperature)}</Text>
        <Text style={[styles.tempDeg, { color: accentColor }]}>°C</Text>
      </View>

      <View style={styles.wmoRow}>
        <Text style={styles.wmoIcon}>{wmo.icon}</Text>
        <Text style={styles.wmoLabel}>{wmo.label}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Líður eins og" value={`${Math.round(current.apparentTemperature)}°`} />
        <StatDivider />
        <Stat
          label="Vindur"
          value={`${getWindDirection(current.windDirection)} ${Math.round(current.windSpeed)} m/s`}
          sub={getBeaufort(current.windSpeed)}
        />
        <StatDivider />
        <Stat label="Raki" value={`${current.humidity}%`} />
      </View>

      <View style={styles.minMaxRow}>
        <Text style={styles.minMaxText}>
          ↑ {Math.round(today.maxTemp)}°  ↓ {Math.round(today.minTemp)}°
        </Text>
        <Text style={styles.sunText}>
          🌅 {today.sunrise.slice(-5)}  🌇 {today.sunset.slice(-5)}
        </Text>
      </View>
    </View>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function StatDivider() {
  return <View style={styles.statDivider} />;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  locationIcon: { fontSize: 13 },
  locationName: {
    fontSize: 13,
    color: "rgba(232,240,245,0.5)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tempBig: {
    fontSize: 96,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 96,
    letterSpacing: -4,
  },
  tempDeg: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 14,
    marginLeft: 4,
  },
  wmoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  wmoIcon: { fontSize: 22 },
  wmoLabel: {
    fontSize: 16,
    color: "rgba(232,240,245,0.7)",
    fontWeight: "400",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  stat: { flex: 1 },
  statLabel: {
    fontSize: 10,
    color: "rgba(232,240,245,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: "#E8F0F5",
    fontWeight: "600",
  },
  statSub: {
    fontSize: 10,
    color: "rgba(232,240,245,0.4)",
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 12,
  },
  minMaxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },
  minMaxText: {
    fontSize: 13,
    color: "rgba(232,240,245,0.5)",
    fontWeight: "500",
  },
  sunText: {
    fontSize: 13,
    color: "rgba(232,240,245,0.5)",
  },
});
