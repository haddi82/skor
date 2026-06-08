import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView, RefreshControl, Linking
} from 'react-native';
import { sækjaLeiki } from '../data/api';

const DEILDIR = [
  { id: 164, nafn: 'Besta deildin KK', land: '🇮🇸' },
  { id: 165, nafn: 'Lengjudeild KK', land: '🇮🇸' },
  { id: 166, nafn: '2. deild KK', land: '🇮🇸' },
  { id: 1, nafn: 'HM 2026', land: '🌍', season: 2026 },
];

const DEILD_STREAMING = {
  164: [{ nafn: 'SÝN', url: 'https://www.syn.is' }],
  165: [],
  166: [],
};

const HM_STREAMING = {
  1489369: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1538999: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1539000: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489370: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489373: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489371: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489372: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489374: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489375: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489376: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489377: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489378: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489379: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489380: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489381: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489382: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489383: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489384: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489385: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489386: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489387: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489388: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489389: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489390: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489391: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489392: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489393: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489394: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489395: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489396: { nafn: 'ITV', url: 'https://www.itv.com/watch/live' },
  1489397: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
  1489398: { nafn: 'BBC', url: 'https://www.bbc.co.uk/iplayer' },
};

function sækjaStöðu(fixture) {
  const s = fixture.fixture.status.short;
  if (['1H','2H','ET','P','LIVE'].includes(s)) return 'live';
  if (['FT','AET','PEN'].includes(s)) return 'lokið';
  return 'óleikinn';
}

export default function DagskraScreen({ onLeikurValinn }) {
  const [leikir, setLeikir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function hlaða() {
    try {
      const niðurstöður = await Promise.all(
        DEILDIR.map(d => sækjaLeiki(d.id, d.season || 2026).then(l => l.map(f => ({ ...f, _deild: d }))))
      );
      const allirLeikir = niðurstöður.flat();
      const núna = new Date();
      const dagFram = new Date(núna.getTime() + 10 * 24 * 60 * 60 * 1000);
      const síaðir = allirLeikir.filter(f => {
        const d = new Date(f.fixture.date);
        return d >= núna && d <= dagFram;
      });
      síaðir.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
      setLeikir(síaðir);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { hlaða(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); hlaða(); }, []);

  const í_dag = new Date().toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });
  const á_morgun = new Date(Date.now() + 86400000).toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });
  let síðasteDagur = null;

  if (loading) return (
    <View style={s.miðja}>
      <ActivityIndicator size="large" color="#1D9E75" />
      <Text style={s.loadingTekst}>Sæki dagskrá...</Text>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <View style={s.haus}>
        <Text style={s.hausTitill}>Dagskrá</Text>
        <Text style={s.hausUndirtitill}>Næstu 10 dagar</Text>
      </View>

      <ScrollView
        style={s.innihald}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D9E75" />}
      >
        {leikir.length === 0 ? (
          <Text style={s.tómur}>Engir leikir á næstu 10 dögum</Text>
        ) : (
          leikir.map(f => {
            const staða = sækjaStöðu(f);
            const dagur = new Date(f.fixture.date);
            const dagStr = dagur.toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' });
            const tími = dagur.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' });
            const sýnaDag = dagStr !== síðasteDagur;
            síðasteDagur = dagStr;
            let dagHeiti = dagStr;
            if (dagStr === í_dag) dagHeiti = 'Í dag';
            if (dagStr === á_morgun) dagHeiti = 'Á morgun';

            const fid = f.fixture.id;
            let streaming = [];
            if (f._deild.id === 1) {
              const hmStream = HM_STREAMING[fid];
              if (hmStream) streaming = [hmStream, { nafn: 'RÚV', url: 'https://www.ruv.is' }];
            } else {
              streaming = DEILD_STREAMING[f._deild.id] || [];
            }

            return (
              <View key={fid}>
                {sýnaDag && <Text style={s.dagHeiti}>{dagHeiti}</Text>}
                <TouchableOpacity onPress={() => onLeikurValinn && onLeikurValinn({
                  id: fid,
                  heima: f.teams.home.name,
                  gestir: f.teams.away.name,
                  heimaStig: f.goals.home,
                  gestaStig: f.goals.away,
                  staða,
                  tími,
                  dagsetning: dagur,
                  deild: f._deild.nafn,
                })}>
                  <View style={[s.kort, staða === 'live' && s.kortLive]}>
                    <View style={s.kortHaus}>
                      <Text style={s.deildNafn}>{f._deild.land} {f._deild.nafn}</Text>
                      <Text style={[s.staðaTekst, staða === 'live' ? s.liveTekst : s.grárTekst]}>
                        {staða === 'live' ? '● LIVE' : tími}
                      </Text>
                    </View>
                    <View style={s.kortMiðja}>
                      <View style={s.lið}>
                        <View style={s.liðLógó}><Text style={s.liðStafur}>{f.teams.home.name[0]}</Text></View>
                        <Text style={s.liðNafn} numberOfLines={1}>{f.teams.home.name}</Text>
                      </View>
                      <Text style={s.vs}>vs</Text>
                      <View style={[s.lið, s.liðHægri]}>
                        <Text style={[s.liðNafn, { textAlign: 'right' }]} numberOfLines={1}>{f.teams.away.name}</Text>
                        <View style={s.liðLógó}><Text style={s.liðStafur}>{f.teams.away.name[0]}</Text></View>
                      </View>
                    </View>
                    {streaming.length > 0 && (
                      <View style={s.streamingBar}>
                        <Text style={s.streamingLabel}>Horfa:</Text>
                        {streaming.map(st => (
                          <TouchableOpacity key={st.nafn} style={s.streamingHnappur}
                            onPress={e => { e.stopPropagation(); Linking.openURL(st.url); }}>
                            <Text style={s.streamingTekst}>{st.nafn}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  haus: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hausTitill: { color: '#fff', fontSize: 18, fontWeight: '600' },
  hausUndirtitill: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  innihald: { flex: 1, paddingHorizontal: 12 },
  miðja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  tómur: { color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', marginTop: 60 },
  dagHeiti: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 4, paddingTop: 16, paddingBottom: 6 },
  kort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  kortLive: { borderColor: 'rgba(29,158,117,0.5)', backgroundColor: 'rgba(29,158,117,0.08)' },
  kortHaus: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  deildNafn: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  staðaTekst: { fontSize: 11 },
  liveTekst: { color: '#1D9E75', fontWeight: '600' },
  grárTekst: { color: 'rgba(255,255,255,0.4)' },
  kortMiðja: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lið: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  liðHægri: { justifyContent: 'flex-end' },
  liðLógó: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  liðStafur: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  liðNafn: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1 },
  vs: { color: 'rgba(255,255,255,0.3)', fontSize: 12, paddingHorizontal: 8 },
  streamingBar: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.08)', gap: 8, flexWrap: 'wrap' },
  streamingLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
  streamingHnappur: { backgroundColor: 'rgba(29,158,117,0.15)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: '#1D9E75' },
  streamingTekst: { color: '#1D9E75', fontSize: 11, fontWeight: '600' },
});