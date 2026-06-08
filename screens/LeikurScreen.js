import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { sækjaAtburði, sækjaTölfræði } from '../data/api';

export default function LeikurScreen({ leikur, onTilbaka }) {
  const [atburðir, setAtburðir] = useState([]);
  const [tölfræði, setTölfræði] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function hlaða() {
    try {
      const [atb, tolf] = await Promise.all([
        sækjaAtburði(leikur.id),
        sækjaTölfræði(leikur.id),
      ]);
      setAtburðir(atb);
      setTölfræði(tolf);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    hlaða();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    hlaða();
  }, []);

  function atburðurTegund(type, detail) {
    if (type === 'Goal') return detail === 'Own Goal' ? '⚽🔴' : '⚽';
    if (type === 'Card') return detail === 'Yellow Card' ? '🟨' : '🟥';
    if (type === 'subst') return '🔄';
    if (type === 'Var') return '📺';
    return '•';
  }

  const heimaId = leikur.heimaId;

  const tölfræðiListi = tölfræði.length >= 2 ? [
    { heiti: 'Skot', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Total Shots')?.value || 0, gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Total Shots')?.value || 0 },
    { heiti: 'Skot á mark', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Shots on Goal')?.value || 0, gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Shots on Goal')?.value || 0 },
    { heiti: 'Horn', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Corner Kicks')?.value || 0, gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Corner Kicks')?.value || 0 },
    { heiti: 'Fælur', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Fouls')?.value || 0, gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Fouls')?.value || 0 },
    { heiti: 'Gular spjöld', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Yellow Cards')?.value || 0, gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Yellow Cards')?.value || 0 },
    { heiti: 'Blóðlegar', heima: tölfræði[0]?.statistics?.find(s => s.type === 'Ball Possession')?.value || '0%', gestir: tölfræði[1]?.statistics?.find(s => s.type === 'Ball Possession')?.value || '0%' },
  ] : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onTilbaka}>
          <Text style={styles.tilbaka}>← Til baka</Text>
        </TouchableOpacity>
        <Text style={styles.deildNafn}>{leikur.deild}</Text>
      </View>

      <ScrollView
        style={styles.innihald}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D9E75" />}
      >
        {/* Stigakort */}
        <View style={styles.stigaKort}>
          <Text style={[styles.stöðuTexti, leikur.staða === 'live' && styles.liveTekst]}>
            {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.staða === 'lokið' ? 'Lokið' : leikur.tími}
          </Text>
          <View style={styles.liðirRow}>
            <Text style={styles.liðNafn}>{leikur.heima}</Text>
            <Text style={styles.stig}>
              {leikur.staða === 'óleikinn' ? leikur.tími : `${leikur.heimaStig ?? 0} – ${leikur.gestaStig ?? 0}`}
            </Text>
            <Text style={styles.liðNafn}>{leikur.gestir}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.miðja}>
            <ActivityIndicator size="large" color="#1D9E75" />
          </View>
        ) : (
          <>
            {/* Atburðir */}
            {atburðir.length > 0 && (
              <>
                <Text style={styles.kaflaHeiti}>Atburðir</Text>
                <View style={styles.atburðaKort}>
                  {atburðir.map((a, i) => {
                    const erHeima = a.team.name === leikur.heima;
                    const tákn = atburðurTegund(a.type, a.detail);
                    return (
                      <View key={i} style={styles.atburður}>
                        {erHeima ? (
                          <>
                            <Text style={styles.atburðurHeima}>{a.player.name} {tákn}</Text>
                            <Text style={styles.atburðurMín}>{a.time.elapsed}'</Text>
                            <Text style={styles.atburðurTómt} />
                          </>
                        ) : (
                          <>
                            <Text style={styles.atburðurTómt} />
                            <Text style={styles.atburðurMín}>{a.time.elapsed}'</Text>
                            <Text style={styles.atburðurGestir}>{tákn} {a.player.name}</Text>
                          </>
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* Tölfræði */}
            {tölfræðiListi.length > 0 && (
              <>
                <Text style={styles.kaflaHeiti}>Tölfræði</Text>
                <View style={styles.tölfræðiKort}>
                  {tölfræðiListi.map((t, i) => {
                    const h = parseFloat(t.heima) || 0;
                    const g = parseFloat(t.gestir) || 0;
                    const samtals = h + g;
                    const heimaPr = samtals > 0 ? h / samtals : 0.5;
                    const gestirPr = samtals > 0 ? g / samtals : 0.5;
                    return (
                      <View key={i} style={styles.tölfræðiRöð}>
                        <Text style={styles.tölfræðiTala}>{t.heima}</Text>
                        <View style={styles.tölfræðiMiðja}>
                          <Text style={styles.tölfræðiHeiti}>{t.heiti}</Text>
                          <View style={styles.stikuContainer}>
                            <View style={[styles.stikuHeima, { flex: heimaPr }]} />
                            <View style={[styles.stikuGestir, { flex: gestirPr }]} />
                          </View>
                        </View>
                        <Text style={styles.tölfræðiTala}>{t.gestir}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {atburðir.length === 0 && tölfræðiListi.length === 0 && (
              <View style={styles.miðja}>
                <Text style={styles.loadingTekst}>Engar upplýsingar tiltækar</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tilbaka: { color: '#1D9E75', fontSize: 16 },
  deildNafn: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  innihald: { flex: 1, padding: 16 },
  miðja: { paddingTop: 40, alignItems: 'center' },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  stigaKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  stöðuTexti: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600', marginBottom: 12 },
  liveTekst: { color: '#1D9E75' },
  liðirRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  liðNafn: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'center' },
  stig: { color: '#fff', fontSize: 36, fontWeight: '700', letterSpacing: 2, paddingHorizontal: 16 },
  kaflaHeiti: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  atburðaKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 24 },
  atburður: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.06)' },
  atburðurHeima: { color: '#fff', fontSize: 13, flex: 1, textAlign: 'right' },
  atburðurGestir: { color: '#fff', fontSize: 13, flex: 1, textAlign: 'left' },
  atburðurMín: { color: '#1D9E75', fontSize: 12, fontWeight: '600', width: 40, textAlign: 'center' },
  atburðurTómt: { flex: 1 },
  tölfræðiKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 24 },
  tölfræðiRöð: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  tölfræðiTala: { color: '#fff', fontSize: 14, fontWeight: '600', width: 40, textAlign: 'center' },
  tölfræðiMiðja: { flex: 1, paddingHorizontal: 12 },
  tölfræðiHeiti: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center', marginBottom: 5 },
  stikuContainer: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' },
  stikuHeima: { backgroundColor: '#1D9E75' },
  stikuGestir: { backgroundColor: 'rgba(255,255,255,0.25)' },
});