import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';

// BREYTTU ÞESSUM UPPLÝSINGUM ÞEGAR NÝR VIÐSKIPTAVINUR KEMUR
const SPONSOR = {
  virkt: true,
  mynd: 'https://raw.githubusercontent.com/haddi82/skor/main/images/satis_banner.png',
  url: 'https://www.satis.is/',
  nafn: 'Satis — Target Tor',
};

export default function SponsorKort() {
  if (!SPONSOR.virkt) return null;

  return (
    <TouchableOpacity
      style={s.container}
      onPress={() => Linking.openURL(SPONSOR.url)}
      activeOpacity={0.85}
    >
      <Text style={s.merki}>AUGLÝSING</Text>
      <Image
        source={{ uri: SPONSOR.mynd }}
        style={s.mynd}
        resizeMode="contain"
      />
      <Text style={s.nafn}>{SPONSOR.nafn}</Text>
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