import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useState, useEffect } from 'react';

const SPONSORS = [
  {
    mynd: 'https://raw.githubusercontent.com/haddi82/skor/master/images/satis_banner.png',
    url: 'https://www.satis.is/',
    nafn: 'Satis — Target Tor',
  },
  // Bættu við fleiri hér:
  // {
  //   mynd: 'https://...',
  //   url: 'https://...',
  //   nafn: 'Nafn fyrirtækis',
  // },
];

let núverandi = 0;

export default function SponsorKort() {
  if (SPONSORS.length === 0) return null;

  const sponsor = SPONSORS[núverandi % SPONSORS.length];
  núverandi++;

  return (
    <TouchableOpacity
      style={s.container}
      onPress={() => Linking.openURL(sponsor.url)}
      activeOpacity={0.85}
    >
      <Text style={s.merki}>AUGLÝSING</Text>
      <Image
        source={{ uri: sponsor.mynd }}
        style={s.mynd}
        resizeMode="contain"
      />
      <Text style={s.nafn}>{sponsor.nafn}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  merki: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  mynd: {
    width: '100%',
    height: 70,
    borderRadius: 8,
  },
  nafn: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginTop: 6,
  },
});