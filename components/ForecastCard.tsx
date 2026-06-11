import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from "react-native";
import { DailyForecast, HourlyForecast } from "../hooks/useWeather";
import { WMO_CODES, DAYS_IS, MONTHS_IS, getWindDirection } from "../constants/locations";

interface Props {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  accentColor: string;
}

export function ForecastStrip({ daily, hourly, accentColor }: Props) {
  const [activeDay, setActiveDay] = React.useState(0);
  const selected = daily[activeDay];

  return (
    <View>
      {/* Hourly strip */}
      <Text style={styles.sectionLabel}>Næstu 24 klukkustundir</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyRow}
      >
        {hourly.slice(0, 24).map((h, i) => {
          const wmo = WMO_CODES[h.weatherCode] ?? { icon: "🌡️" };
          const hour = h.time.slice(11, 16);
          return (
            <View key={i} style={styles.hourCard}>
              <Text style={styles.hourTime}>{hour}</Text>
              <Text style={styles.hourIcon}>{wmo.icon}</Text>
              <Text style={styles.hourTemp}>{Math.round(h.temperature)}°</Text>
              {h.precipitation > 0.1 && (
                <Text style={styles.hourPrecip}>{h.precipitation.toFixed(1)}mm</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* 7-day strip */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>7 daga spá</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dailyRow}
      >
        {daily.map((day, i) => {
          const d = new Date(day.date);
          const label = i === 0 ? "Í dag" : i === 1 ? "Á morgun" : DAYS_IS[d.getDay()];
          const wmo = WMO_CODES[day.weatherCode] ?? { icon: "🌡️" };
          const isActive = i === activeDay;
          return (
            <TouchableOpacity
              key={day.date}
              onPress={() => setActiveDay(i)}
              style={[
                styles.dayCard,
                isActive && { backgroundColor: "rgba(255,255,255,0.1)", borderColor: accentColor + "66" },
              ]}
            >
              <Text style={styles.dayLabel}>{label}</Text>
              <Text style={styles.dayIcon}>{wmo.icon}</Text>
              <Text style={styles.dayMax}>{Math.round(day.maxTemp)}°</Text>
              <Text style={styles.dayMin}>{Math.round(day.minTemp)}°</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Detail card for selected day */}
      {selected && (
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>
            {activeDay === 0
              ? "Í dag"
              : activeDay === 1
              ? "Á morgun"
              : (() => {
                  const d = new Date(selected.date);
                  return `${DAYS_IS[d.getDay()]} ${d.getDate()}. ${MONTHS_IS[d.getMonth()]}`;
                })()}
          </Text>
          <View style={styles.detailGrid}>
            <DetailItem label="Hæsta hiti"  value={`${Math.round(selected.maxTemp)}°C`} />
            <DetailItem label="Lægsta hiti" value={`${Math.round(selected.minTemp)}°C`} />
            <DetailItem label="Úrkoma"      value={`${selected.precipitation.toFixed(1)} mm`} />
            <DetailItem
              label="Vindur"
              value={`${getWindDirection(selected.dominantWindDir)} ${Math.round(selected.maxWindSpeed)} m/s`}
            />
            <DetailItem label="Sólarupprás" value={selected.sunrise.slice(-5)} />
            <DetailItem label="Sólsetur"    value={selected.sunset.slice(-5)} />
          </View>
        </View>
      )}
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 10,
    color: "rgba(232,240,245,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  hourlyRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  hourCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    minWidth: 52,
    gap: 4,
  },
  hourTime: { fontSize: 11, color: "rgba(232,240,245,0.45)" },
  hourIcon: { fontSize: 16 },
  hourTemp: { fontSize: 14, fontWeight: "600", color: "#E8F0F5" },
  hourPrecip: { fontSize: 9, color: "#6DB8E8" },
  dailyRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    minWidth: 76,
    gap: 4,
  },
  dayLabel: {
    fontSize: 10,
    color: "rgba(232,240,245,0.5)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  dayIcon: { fontSize: 20, marginVertical: 4 },
  dayMax: { fontSize: 16, fontWeight: "700", color: "#fff" },
  dayMin: { fontSize: 12, color: "rgba(232,240,245,0.4)" },
  detailCard: {
    marginHorizontal: 24,
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 18,
  },
  detailTitle: {
    fontSize: 12,
    color: "rgba(232,240,245,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: { width: "45%" },
  detailLabel: {
    fontSize: 10,
    color: "rgba(232,240,245,0.4)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8F0F5",
  },
});
