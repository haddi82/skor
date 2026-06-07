import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import LeikurScreen from './screens/LeikurScreen';
import StandingsScreen from './screens/StandingsScreen';
import { sækjaLeiki } from './data/api';

const DEILDIR = ['Allir', 'Í dag', 'Óleikinn', 'Lokið'];

function sækjaStöðu(fixture) {
  const s = fixture.fixture.status.short;
  if (['1H','2H','ET','P','LIVE'].includes(s)) return 'live';
  if (['FT','AET','PEN'].includes(s)) return 'lokið';
  return 'óleikinn';
}

function forskoðaLeik(fixture) {
  const staða = sækjaStöðu(fixture);
  const dagur = new Date(fixture.fixture.date);
  const tími = dagur.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' });
  return {
    id: fixture.fixture.id,
    heima: fixture.teams.home.name,
    gestir: fixture.teams.away.name,
    heimaStig: fixture.goals.home,
    gestaStig: fixture.goals.away,
    staða,
    tími: staða === 'live' ? `${fixture.fixture.status.elapsed}'` : staða === 'lokið' ? 'Lokið' : tími,
    dagsetning: dagur,
    deild: 'Úrvalsdeild KK',
  };
}

export default function App() {
  const [valinFlipa, setValinFlipa] = useState('Allir');
  const [valinnLeikur, setValinnLeikur] = useState(null);
  const [sýnaStigatafla, setSýnaStigatafla] = useState(false);
  const [leikir, setLeikir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function hlaða() {
    try {
      const gögn = await sækjaLeiki(164);
      setLeikir(gögn.map(forskoðaLeik));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    hlaða();
    const interval = setInterval(hlaða, 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    hlaða();
  }, []);

  const í_dag = new Date().toDateString();
  const síaðirLeikir = leikir
    .filter(l => {
      if (valinFlipa === 'Allir') return true;
      if (valinFlipa === 'Í dag') return l.dagsetning.toDateString() === í_dag;
      if (valinFlipa === 'Óleikinn') return l.staða === 'óleikinn';
      if (valinFlipa === 'Lokið') return l.staða === 'lokið';
      return true;
    })
    .sort((a, b) => {
      const röð = { live: 0, óleikinn: 1, lokið: 2 };
      if (röð[a.staða] !== röð[b.staða]) return röð[a.staða] - röð[b.staða];
      if (a.staða === 'óleikinn') return a.dagsetning - b.dagsetning;
      if (a.staða === 'lokið') return b.dagsetning - a.dagsetning;
      return 0;
    });

  if (valinnLeikur) {
    return <LeikurScreen leikur={valinnLeikur} onTilbaka={() => setValinnLeikur(null)} />;
  }

  if (sýnaStigatafla) {
    return <StandingsScreen onTilbaka={() => setSýnaStigatafla(false)} />;
  }

  const í_dag_str = new Date().toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });
  const á_morgun_str = new Date(Date.now() + 86400000).toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });

  let síðasteDagur = null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.lógó}>Sk<Text style={styles.lógóO}>o</Text>r</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flipaBar}>
        {DEILDIR.map(d => (
          <TouchableOpacity key={d} onPress={() => setValinFlipa(d)} style={[styles.flipa, valinFlipa === d && styles.flipaVakin]}>
            <Text style={[styles.flipaTekst, valinFlipa === d && styles.flipaTekstVakinn]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.miðja}>
          <ActivityIndicator size="large" color="#1D9E75" />
          <Text style={styles.loadingTekst}>Sæki leiki...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.leikirListi}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D9E75" />}
        >
          {síaðirLeikir.length === 0 ? (
            <View style={styles.miðja}>
              <Text style={styles.loadingTekst}>Engir leikir</Text>
            </View>
          ) : (
            síaðirLeikir.map(leikur => {
              const dagur = leikur.dagsetning.toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });
              const sýnaDag = dagur !== síðasteDagur;
              síðasteDagur = dagur;
              let dagHeiti = dagur;
              if (dagur === í_dag_str) dagHeiti = 'Í dag';
              if (dagur === á_morgun_str) dagHeiti = 'Á morgun';
              return (
                <View key={leikur.id}>
                  {sýnaDag && <Text style={styles.dagHeiti}>{dagHeiti}</Text>}
                  <TouchableOpacity onPress={() => setValinnLeikur(leikur)}>
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
                </View>
              );
            })
          )}
        </ScrollView>
      )}

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
  miðja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60 },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  dagHeiti: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 4, paddingTop: 16, paddingBottom: 6 },
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