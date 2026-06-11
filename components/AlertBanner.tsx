import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { IMOAlert, SEVERITY_COLORS, SEVERITY_LABELS } from "../hooks/useAlerts";

interface Props {
  alerts: IMOAlert[];
}

export function AlertBanner({ alerts }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚠️ Viðvaranir</Text>
      {alerts.map(alert => {
        const color = SEVERITY_COLORS[alert.severity] ?? "#FFD84D";
        const isOpen = expanded === alert.id;

        return (
          <TouchableOpacity
            key={alert.id}
            onPress={() => setExpanded(isOpen ? null : alert.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.alertCard, { borderLeftColor: color }]}>
              <View style={styles.alertTop}>
                <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
                  <Text style={[styles.badgeText, { color }]}>
                    {SEVERITY_LABELS[alert.severity]}
                  </Text>
                </View>
                <Text style={styles.alertTitle} numberOfLines={isOpen ? undefined : 1}>
                  {alert.title}
                </Text>
                <Text style={styles.chevron}>{isOpen ? "∧" : "∨"}</Text>
              </View>

              {isOpen && (
                <View style={styles.alertBody}>
                  {alert.description ? (
                    <Text style={styles.alertDesc}>{alert.description}</Text>
                  ) : null}
                  {alert.areas.length > 0 && (
                    <Text style={styles.alertAreas}>
                      📍 {alert.areas.join(" · ")}
                    </Text>
                  )}
                  {alert.expires && (
                    <Text style={styles.alertExpiry}>
                      Gildir til: {new Date(alert.expires).toLocaleString("is-IS", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  header: {
    fontSize: 10,
    color: "rgba(232,240,245,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  alertCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderLeftWidth: 3,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  alertTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  alertTitle: {
    flex: 1,
    fontSize: 13,
    color: "#E8F0F5",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 12,
    color: "rgba(232,240,245,0.4)",
  },
  alertBody: {
    marginTop: 12,
    gap: 8,
  },
  alertDesc: {
    fontSize: 13,
    color: "rgba(232,240,245,0.65)",
    lineHeight: 19,
  },
  alertAreas: {
    fontSize: 12,
    color: "rgba(232,240,245,0.45)",
  },
  alertExpiry: {
    fontSize: 11,
    color: "rgba(232,240,245,0.35)",
    fontStyle: "italic",
  },
});
