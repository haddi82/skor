import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import LeikurScreen from './screens/LeikurScreen';
import StandingsScreen from './screens/StandingsScreen';

const DEILDIR = ['Allt', 'Ísland', 'EPL', 'NBA', 'Handbolti'];

const LEIKIR = [
  { id: 1, deild: 'Ísland', heima: 'Víkingur', gestir: 'KR', heimaStig: 2, gestaStig: 1, staða: 'live', tími: "64'" },
  { id: 2, deild: 'Ísland', heima: 'Breiðablik', gestir: 'Stjarnan', heimaStig: 3, gestaStig: 0, staða: 'lokið', tími: 'Lokið' },
  { id: 3, deild: 'EPL', heima: 'Arsenal', gestir: 'Man City', heimaStig: 2, gestaStig: 2, staða: 'lokið', tími: 'Lokið' },
  { id: 4, deild: 'Ísland', heima: 'Valur', gestir: 'Fram', heimaStig: null, gestaStig: null, staða: 'óleikinn', tími: '19:00' },
  { id: 5, deild: 'NBA', heima: 'Lakers', gestir: 'Celtics', heimaStig: 98, gestaStig: 104, staða: 'live', tími: "Q3" },
  { id: 6, deild: 'Handbolti', heima: 'Haukar', gestir: 'Selfoss', heimaStig: 28, gestaStig: 31, staða: 'lokið', tími: 'Lokið' },
];

export default function App() {
  const [valinDeild, setValinDeild] = useState('Allt');
  const [valinnLeikur, setValinnLeikur] = useState(null);
  const [sýnaStigatafla, setSýnaStigatafla] = useState(false);

  const síaðirLeikir = valinDeild === 'Allt' ? LEIKIR : LEIKIR.filter(l => l.deild === valinDeild);

  if (valinnLeikur) {
    return <LeikurScreen leikur={valinnLeikur} onTilbaka={() => setValinnLeikur(null)} />;
  }

  if (sýnaStigatafla) {
    return <StandingsScreen onTilbaka={() => setSýnaStigatafla(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.lógó}>Sk<Text style={styles.lógóO}>o</Text>r</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flipaBar}>
        {DEILDIR.map(d => (
          <TouchableOpacity key={d} onPress={() => setValinDeild(d)} style={[styles.flipa, valinDeild === d && styles.flipaVakin]}>
            <Text style={[styles.flipaTekst, valinDeild === d && styles.flipaTekstVakinn]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.leikirListi}>
        {síaðirLeikir.map(leikur => (
          <TouchableOpacity key={leikur.id} onPress={() => setValinnLeikur(leikur)}>
            <View style={[styles.leikurKort, leikur.staða === 'live' && styles.leikurKortLive]}>
              <View style={styles.leikurHaus}>
                <Text style={styles.deildNafn}>{leikur.deild}</Text>
                <Text style={[styles.stöðuTekst, leikur.staða === 'live' ? styles.liveTekst : styles.lokiðTekst]}>
                  {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.tími}
                </Text>
              </View>
              <View style={styles.leikurMiðja}>
                <View style={styles.lið}>
                  <View style={styles.liðLógó}><Text style={styles.liðStafur}>{leikur.heima[0]}</Text></View>
                  <Text style={styles.liðNafn} numberOfLines={1}>{leikur.heima}</Text>
                </View>
                <View style={styles.stigBox}>
                  {leikur.staða === 'óleikinn' ? (
                    <Text style={styles.óleikinnTími}>{leikur.tími}</Text>
                  ) : (
                    <Text style={styles.stig}>{leikur.heimaStig} – {leikur.gestaStig}</Text>
                  )}
                </View>
                <View style={[styles.lið, styles.liðHægri]}>
                  <Text style={[styles.liðNafn, {textAlign:'right'}]} numberOfLines={1}>{leikur.gestir}</Text>
                  <View style={styles.liðLógó}><Text style={styles.liðStafur}>{leikur.gestir[0]}</Text></View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.neðriFlipir}>
        {[['🏠','Heim'],['📊','Tafla'],['📅','Dagskrá'],['⭐','Mínir'],['⚙️','Stillingar']].map(([icon, nafn]) => (
          <TouchableOpacity key={nafn} style={styles.neðriFlip} onPress={() => nafn === 'Tafla' && setSýnaStigatafla(true)}>
            <Text style={styles.neðriIcon}>{icon}</Text>
            <Text style={styles.neðriTekst}>{nafn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lógó: { fontSize: 28, fontWeight: '600', color: '#fff' },
  lógóO: { color: '#1D9E75' },
  flipaBar: { paddingHorizontal: 12, paddingBottom: 10, flexGrow: 0 },
  flipa: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginHorizontal: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  flipaVakin: { backgroundColor: '#1D9E75' },
  flipaTekst: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  flipaTekstVakinn: { color: '#04342C', fontWeight: '600' },
  leikirListi: { flex: 1, paddingHorizontal: 12 },
  leikurKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  leikurKortLive: { borderColor: 'rgba(29,158,117,0.5)', backgroundColor: 'rgba(29,158,117,0.08)' },
  leikurHaus: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  deildNafn: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  stöðuTekst: { fontSize: 11 },
  liveTekst: { color: '#1D9E75', fontWeight: '600' },
  lokiðTekst: { color: 'rgba(255,255,255,0.3)' },
  leikurMiðja: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lið: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  liðHægri: { justifyContent: 'flex-end' },
  liðLógó: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  liðStafur: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  liðNafn: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1 },
  stigBox: { paddingHorizontal: 8 },
  stig: { color: '#fff', fontSize: 22, fontWeight: '600', letterSpacing: 1 },
  óleikinnTími: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  neðriFlipir: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.08)', paddingBottom: 20 },
  neðriFlip: { alignItems: 'center', gap: 3 },
  neðriIcon: { fontSize: 20 },
  neðriTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
});