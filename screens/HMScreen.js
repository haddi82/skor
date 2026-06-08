import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, RefreshControl
} from 'react-native';
import { sækjaLeiki, sækjaStigatoflu, sækjaMarkaskorarar, sækjaMarkavörður } from '../data/api';

const HM_ID = 1;
const FLIPAR = ['Leikir', 'Riðlar', 'Markaskorarar', 'Stoðsendingar'];

function sækjaStöðu(fixture) {
  const s = fixture.fixture.status.short;
  if (['1H','2H','ET','P','LIVE'].includes(s)) return 'live';
  if (['FT','AET','PEN'].includes(s)) return 'lokið';
  return 'óleikinn';
}
function þýðaHóp(nafn) {
  if (!nafn) return '';
  if (nafn.startsWith('Group ')) return 'Riðill ' + nafn.replace('Group ', '');
  if (nafn === 'Ranking of third-placed teams') return 'Bestu þriðja sætis liðin';
  return nafn;
}

export default function HMScreen({ onLeikurValinn }) {
  const [virkurFlipi, setVirkurFlipi] = useState('Leikir');
  const [leikir, setLeikir] = useState([]);
  const [riðlar, setRiðlar] = useState([]);
  const [skorarar, setSkorarar] = useState([]);
  const [stoðsendingar, setStoðsendingar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function hlaða() {
    setLoading(true);
    try {
      const [l, r, s, st] = await Promise.all([
        sækjaLeiki(HM_ID),
        sækjaStigatoflu(HM_ID),
        sækjaMarkaskorarar(HM_ID),
        sækjaMarkavörður(HM_ID),
      ]);
      setLeikir(l || []);
      setRiðlar(r || []);
      setSkorarar(s || []);
      setStoðsendingar(st || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { hlaða(); }, []);

  const onRefresh = () => { setRefreshing(true); hlaða(); };

  const raðaðirLeikir = [...leikir]
    .map(f => {
      const staða = sækjaStöðu(f);
      const dagur = new Date(f.fixture.date);
      return {
        id: f.fixture.id,
        heima: f.teams.home.name,
        gestir: f.teams.away.name,
        heimaStig: f.goals.home,
        gestaStig: f.goals.away,
        staða,
        tími: staða === 'live'
          ? `${f.fixture.status.elapsed}'`
          : staða === 'lokið' ? 'Lokið'
          : dagur.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }),
        dagsetning: dagur,
        dagur: dagur.toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short' }),
        keppni: f.league?.round || '',
      };
    })
    .sort((a, b) => {
      const röð = { live: 0, óleikinn: 1, lokið: 2 };
      if (röð[a.staða] !== röð[b.staða]) return röð[a.staða] - röð[b.staða];
      if (a.staða === 'óleikinn') return a.dagsetning - b.dagsetning;
      return b.dagsetning - a.dagsetning;
    });

  if (loading) {
    return (
      <View style={s.miðja}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={s.loadingTekst}>Sæki HM gögn...</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Innri flipar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.flipaBar}>
        {FLIPAR.map(f => (
          <TouchableOpacity key={f} onPress={() => setVirkurFlipi(f)}
            style={[s.flipi, virkurFlipi === f && s.flipiVirkur]}>
            <Text style={[s.flipiTekst, virkurFlipi === f && s.flipiTekstVirkur]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={s.innihald}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D9E75" />}
      >
        {/* LEIKIR */}
        {virkurFlipi === 'Leikir' && (
          raðaðirLeikir.length === 0
            ? <Text style={s.tómur}>Engir leikir fundust</Text>
            : raðaðirLeikir.map(leikur => (
              <TouchableOpacity key={leikur.id} onPress={() => onLeikurValinn && onLeikurValinn({
                ...leikur, deild: 'Heimsmeistarmót 2026'
              })}>
                <View style={[s.kort, leikur.staða === 'live' && s.kortLive]}>
                  <View style={s.kortHaus}>
                    <Text style={s.keppniTekst}>{leikur.keppni?.replace('Group Stage', 'Riðlastig')}</Text>
                    <Text style={[s.staðaTekst, leikur.staða === 'live' ? s.liveTekst : s.lokiðTekst]}>
                      {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.staða === 'lokið' ? 'Lokið' : leikur.dagur}
                    </Text>
                  </View>
                  <View style={s.kortMiðja}>
                    <View style={s.lið}>
                      <View style={s.liðLógó}><Text style={s.liðStafur}>{leikur.heima[0]}</Text></View>
                      <Text style={s.liðNafn} numberOfLines={1}>{leikur.heima}</Text>
                    </View>
                    <View style={s.stigBox}>
                      {leikur.staða === 'óleikinn'
                        ? <Text style={s.óleikinnTími}>{leikur.tími}</Text>
                        : <Text style={s.stig}>{leikur.heimaStig} – {leikur.gestaStig}</Text>
                      }
                    </View>
                    <View style={[s.lið, s.liðHægri]}>
                      <Text style={[s.liðNafn, { textAlign: 'right' }]} numberOfLines={1}>{leikur.gestir}</Text>
                      <View style={s.liðLógó}><Text style={s.liðStafur}>{leikur.gestir[0]}</Text></View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
        )}

        {/* RIÐLAR */}
        {virkurFlipi === 'Riðlar' && (
          riðlar.length === 0
            ? <Text style={s.tómur}>Engar stigatöflur fundust</Text>
            : riðlar.map((hópur, idx) => (
              <View key={idx} style={s.riðillKort}>
                <Text style={s.riðillHeiti}>{þýðaHóp(hópur[0]?.group) || `Hópur ${idx + 1}`}</Text>
                <View style={s.töfluHaus}>
                  <Text style={[s.töfluDálkur, { flex: 3 }]}>Lið</Text>
                  <Text style={s.töfluDálkur}>L</Text>
                  <Text style={s.töfluDálkur}>S</Text>
                  <Text style={s.töfluDálkur}>J</Text>
                  <Text style={s.töfluDálkur}>T</Text>
                  <Text style={[s.töfluDálkur, s.töfluStig]}>Stig</Text>
                </View>
                {hópur.map((lið, i) => (
                  <View key={i} style={[s.töfluRöð, i < 2 && hópur[0]?.group?.startsWith('Group') && s.framhaldRöð, i >= hópur.length - 2 && hópur[0]?.group?.startsWith('Group') && s.úrLeikRöð]}>
                    <View style={[{ flex: 3 }, s.liðNafnRow]}>
                      <Text style={s.raðNúmer}>{i + 1}</Text>
                      <Text style={s.töfluLið} numberOfLines={1}>{lið.team.name}</Text>
                    </View>
                    <Text style={s.töfluTala}>{lið.all.win}</Text>
                    <Text style={s.töfluTala}>{lið.all.draw}</Text>
                    <Text style={s.töfluTala}>{lið.all.lose}</Text>
                    <Text style={s.töfluTala}>{lið.goalsDiff > 0 ? `+${lið.goalsDiff}` : lið.goalsDiff}</Text>
                    <Text style={[s.töfluTala, s.töfluStig]}>{lið.points}</Text>
                  </View>
                ))}
              </View>
            ))
        )}

        {/* SKORARAR */}
        {virkurFlipi === 'Markaskorarar' && (
          skorarar.length === 0
            ? <Text style={s.tómur}>Engar upplýsingar enn</Text>
            : skorarar.slice(0, 20).map((item, i) => (
              <View key={i} style={s.leikmaðurRöð}>
                <Text style={s.raðNúmerStór}>{i + 1}</Text>
                <View style={s.leikmaðurLógó}>
                  <Text style={s.liðStafur}>{item.player.name[0]}</Text>
                </View>
                <View style={s.leikmaðurInfo}>
                  <Text style={s.leikmaðurNafn}>{item.player.name}</Text>
                  <Text style={s.leikmaðurLið}>{item.statistics[0]?.team?.name}</Text>
                </View>
                <Text style={s.tölfræðiTala}>{item.statistics[0]?.goals?.total ?? 0}</Text>
                <Text style={s.tölfræðiLabel}>mark</Text>
              </View>
            ))
        )}

        {/* STOÐSENDINGAR */}
        {virkurFlipi === 'Stoðsendingar' && (
          stoðsendingar.length === 0
            ? <Text style={s.tómur}>Engar upplýsingar enn</Text>
            : stoðsendingar.slice(0, 20).map((item, i) => (
              <View key={i} style={s.leikmaðurRöð}>
                <Text style={s.raðNúmerStór}>{i + 1}</Text>
                <View style={s.leikmaðurLógó}>
                  <Text style={s.liðStafur}>{item.player.name[0]}</Text>
                </View>
                <View style={s.leikmaðurInfo}>
                  <Text style={s.leikmaðurNafn}>{item.player.name}</Text>
                  <Text style={s.leikmaðurLið}>{item.statistics[0]?.team?.name}</Text>
                </View>
                <Text style={s.tölfræðiTala}>{item.statistics[0]?.goals?.assists ?? 0}</Text>
                <Text style={s.tölfræðiLabel}>sen</Text>
              </View>
            ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  miðja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  tómur: { color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', marginTop: 60 },
  flipaBar: { paddingHorizontal: 12, paddingVertical: 8, flexGrow: 0 },
  flipi: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, marginHorizontal: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  flipiVirkur: { backgroundColor: 'rgba(29,158,117,0.2)', borderColor: '#1D9E75' },
  flipiTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  flipiTekstVirkur: { color: '#1D9E75', fontWeight: '600' },
  innihald: { flex: 1, paddingHorizontal: 12 },
  kort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  kortLive: { borderColor: 'rgba(29,158,117,0.5)', backgroundColor: 'rgba(29,158,117,0.08)' },
  kortHaus: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  keppniTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  staðaTekst: { fontSize: 11 },
  liveTekst: { color: '#1D9E75', fontWeight: '600' },
  lokiðTekst: { color: 'rgba(255,255,255,0.3)' },
  kortMiðja: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lið: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  liðHægri: { justifyContent: 'flex-end' },
  liðLógó: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  liðStafur: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  liðNafn: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1 },
  stigBox: { paddingHorizontal: 8 },
  stig: { color: '#fff', fontSize: 22, fontWeight: '600', letterSpacing: 1 },
  óleikinnTími: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  riðillKort: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  riðillHeiti: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  töfluHaus: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.08)', marginBottom: 4 },
  töfluDálkur: { flex: 1, color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center' },
  töfluStig: { fontWeight: '700', color: '#1D9E75' },
  töfluRöð: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.05)' },
  framhaldRöð: { borderLeftWidth: 2, borderLeftColor: '#1D9E75' },
  úrLeikRöð: { borderLeftWidth: 2, borderLeftColor: '#E24B4A' },
  liðNafnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  raðNúmer: { color: 'rgba(255,255,255,0.3)', fontSize: 11, width: 22, paddingLeft: 6 },
  töfluLið: { color: '#fff', fontSize: 13, flex: 1 },
  töfluTala: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },
  leikmaðurRöð: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.07)' },
  raðNúmerStór: { color: 'rgba(255,255,255,0.3)', fontSize: 13, width: 20, textAlign: 'center' },
  leikmaðurLógó: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  leikmaðurInfo: { flex: 1 },
  leikmaðurNafn: { color: '#fff', fontSize: 14, fontWeight: '500' },
  leikmaðurLið: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  tölfræðiTala: { color: '#1D9E75', fontSize: 20, fontWeight: '700' },
  tölfræðiLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
});