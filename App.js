import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
const API_SPORTS_KEY = '95c658499c779d22042a924ae8610a0a';

const DEILDIR = ['Allt', 'Ísland', 'EPL', 'NBA', 'Handbolti'];

export default function App() {
  const [valinDeild, setValinDeild] = useState('Allt');
  const [leikir, setLeikir] = useState([]);
  const [hleður, setHleður] = useState(true);

  useEffect(() => {
    sækjaLeiki();
  }, []);

  const sækjaLeiki = async () => {
    setHleður(true);
    try {
      const dagur = new Date().toISOString().split('T')[0];
      
      const svar = await fetch(`https://v3.football.api-sports.io/fixtures?date=${dagur}&league=164&season=2026`, {
        headers: {
          'x-apisports-key': API_SPORTS_KEY
        }
      });
      const gögn = await svar.json();
      
      const íslenskir = gögn.response?.map(f => ({
        id: f.fixture.id,
        deild: 'Ísland',
        heima: f.teams.home.name,
        gestir: f.teams.away.name,
        heimaStig: f.goals.home,
        gestaStig: f.goals.away,
        staða: f.fixture.status.short === 'FT' ? 'lokið' : 
               f.fixture.status.short === 'NS' ? 'óleikinn' : 'live',
        tími: f.fixture.status.short === 'NS' ? 
              new Date(f.fixture.date).toLocaleTimeString('is-IS', {hour:'2-digit', minute:'2-digit'}) :
              f.fixture.status.short === 'FT' ? 'Lokið' : `${f.fixture.status.elapsed}'`
      })) || [];

      setLeikir(íslenskir.length > 0 ? íslenskir : GERVILEIKIR);
    } catch (villa) {
      console.log('Villa:', villa);
      setLeikir(GERVILEIKIR);
    }
    setHleður(false);
  };

  const GERVILEIKIR = [
    { id: 1, deild: 'Ísland', heima: 'Víkingur', gestir: 'KR', heimaStig: 2, gestaStig: 1, staða: 'live', tími: "64'" },
    { id: 2, deild: 'Ísland', heima: 'Breiðablik', gestir: 'Stjarnan', heimaStig: 3, gestaStig: 0, staða: 'lokið', tími: 'Lokið' },
    { id: 3, deild: 'EPL', heima: 'Arsenal', gestir: 'Man City', heimaStig: 2, gestaStig: 2, staða: 'lokið', tími: 'Lokið' },
    { id: 4, deild: 'Ísland', heima: 'Valur', gestir: 'Fram', heimaStig: null, gestaStig: null, staða: 'óleikinn', tími: '19:00' },
    { id: 5, deild: 'NBA', heima: 'Lakers', gestir: 'Celtics', heimaStig: 98, gestaStig: 104, staða: 'live', tími: "Q3" },
    { id: 6, deild: 'Handbolti', heima: 'Haukar', gestir: 'Selfoss', heimaStig: 28, gestaStig: 31, staða: 'lokið', tími: 'Lokið' },
  ];

  const síaðirLeikir = valinDeild === 'Allt' ? leikir : leikir.filter(l => l.deild === valinDeild);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.lógó}>Sk<Text style={styles.lógóO}>o</Text>r</Text>
        <TouchableOpacity onPress={sækjaLeiki} style={styles.uppfæraHnappur}>
          <Text style={styles.uppfæraTekst}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flipaBar}>
        {DEILDIR.map(d => (
          <TouchableOpacity key={d} onPress={() => setValinDeild(d)} style={[styles.flipa, valinDeild === d && styles.flipaVakin]}>
            <Text style={[styles.flipaTekst, valinDeild === d && styles.flipaTekstVakinn]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {hleður ? (
        <View style={styles.hleðurBox}>
          <ActivityIndicator size="large" color="#1D9E75" />
          <Text style={styles.hleðurTekst}>Sæki leiki...</Text>
        </View>
      ) : (
        <ScrollView style={styles.leikirListi}>
          {síaðirLeikir.length === 0 ? (
            <Text style={styles.engirLeikir}>Engir leikir í dag</Text>
          ) : (
            síaðirLeikir.map(leikur => (
              <View key={leikur.id} style={[styles.leikurKort, leikur.staða === 'live' && styles.leikurKortLive]}>
                <View style={styles.leikurHaus}>
                  <Text style={styles.deildNafn}>{leikur.deild}</Text>
                  <View style={[styles.stöðuMerki, leikur.staða === 'live' ? styles.liveMerki : leikur.staða === 'óleikinn' ? styles.óleikinnMerki : styles.lokiðMerki]}>
                    <Text style={[styles.stöðuTekst, leikur.staða === 'live' ? styles.liveTekst : leikur.staða === 'óleikinn' ? styles.óleikinnTekst : styles.lokiðTekst]}>
                      {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.tími}
                    </Text>
                  </View>
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
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.neðriFlipir}>
        {[['🏠','Heim'],['📊','Tafla'],['📅','Dagskrá'],['⭐','Mínir'],['⚙️','Stillingar']].map(([icon, nafn]) => (
          <TouchableOpacity key={nafn} style={styles.neðriFlip}>
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
  uppfæraHnappur: { padding: 8 },
  uppfæraTekst: { color: '#1D9E75', fontSize: 22 },
  flipaBar: { paddingHorizontal: 12, paddingBottom: 10, flexGrow: 0 },
  flipa: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginHorizontal: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  flipaVakin: { backgroundColor: '#1D9E75' },
  flipaTekst: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  flipaTekstVakinn: { color: '#04342C', fontWeight: '600' },
  leikirListi: { flex: 1, paddingHorizontal: 12 },
  hleðurBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  hleðurTekst: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  engirLeikir: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40, fontSize: 14 },
  leikurKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  leikurKortLive: { borderColor: 'rgba(29,158,117,0.5)', backgroundColor: 'rgba(29,158,117,0.08)' },
  leikurHaus: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  deildNafn: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  stöðuMerki: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  liveMerki: { backgroundColor: 'rgba(29,158,117,0.2)' },
  óleikinnMerki: { backgroundColor: 'rgba(255,255,255,0.08)' },
  lokiðMerki: { backgroundColor: 'transparent' },
  stöðuTekst: { fontSize: 11 },
  liveTekst: { color: '#1D9E75', fontWeight: '600' },
  óleikinnTekst: { color: 'rgba(255,255,255,0.5)' },
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