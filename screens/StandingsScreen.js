import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { sækjaStigatoflu } from '../data/api';

export default function StandingsScreen({ onTilbaka }) {
  const [stigatafla, setStigatafla] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [villa, setVilla] = useState(null);

  async function hlaða() {
    try {
      const gögn = await sækjaStigatoflu(164);
      setStigatafla(gögn);
      setVilla(null);
    } catch (e) {
      setVilla('Gat ekki sótt stigatöflu');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onTilbaka}>
          <Text style={styles.tilbaka}>← Til baka</Text>
        </TouchableOpacity>
        <Text style={styles.titill}>Stigatafla</Text>
        <Text style={styles.deild}>Úrvalsdeild</Text>
      </View>

      {loading && (
        <View style={styles.miðja}>
          <ActivityIndicator size="large" color="#1D9E75" />
          <Text style={styles.loadingTekst}>Sæki gögn...</Text>
        </View>
      )}

      {villa && (
        <View style={styles.miðja}>
          <Text style={styles.villaTekst}>{villa}</Text>
          <TouchableOpacity onPress={hlaða} style={styles.reyndurAftur}>
            <Text style={styles.reyndurAfturTekst}>Reyna aftur</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !villa && (
        <ScrollView
          style={styles.innihald}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D9E75" />
          }
        >
          <View style={styles.hausRöð}>
            <Text style={[styles.hausTekst, { width: 28 }]}>#</Text>
            <Text style={[styles.hausTekst, { flex: 1 }]}>Lið</Text>
            <Text style={styles.hausDálkur}>L</Text>
            <Text style={styles.hausDálkur}>S</Text>
            <Text style={styles.hausDálkur}>J</Text>
            <Text style={styles.hausDálkur}>T</Text>
            <Text style={styles.hausDálkur}>M</Text>
            <Text style={[styles.hausDálkur, { color: '#1D9E75' }]}>Stig</Text>
          </View>

          {stigatafla.map((lið, i) => (
            <View key={lið.team.id}>
              {i === 6 && <View style={styles.splitLína} />}
              <View style={[styles.röð, i % 2 === 0 && styles.röðDökkur]}>
                <Text style={[styles.sætiTekst, lið.rank <= 3 && styles.efstSæti, lið.rank >= 11 && styles.neðstSæti]}>
                  {lið.rank}
                </Text>
                <View style={styles.liðInfo}>
                  <View style={styles.liðLógó}>
                    <Text style={styles.liðStafur}>{lið.team.name[0]}</Text>
                  </View>
                  <Text style={styles.liðNafn} numberOfLines={1}>{lið.team.name}</Text>
                </View>
                <Text style={styles.dálkur}>{lið.all.played}</Text>
                <Text style={styles.dálkur}>{lið.all.win}</Text>
                <Text style={styles.dálkur}>{lið.all.draw}</Text>
                <Text style={styles.dálkur}>{lið.all.lose}</Text>
                <Text style={[styles.dálkur, {width: 44}]}>{lið.all.goals.for}-{lið.all.goals.against}</Text>
                <Text style={styles.stigDálkur}>{lið.points}</Text>
              </View>
            </View>
          ))}

          <View style={styles.skýringar}>
            <View style={styles.skýring}><View style={[styles.skýringarLit, { backgroundColor: '#1D9E75' }]} /><Text style={styles.skýringarTekst}>Evrópusæti</Text></View>
            <View style={styles.skýring}><View style={[styles.skýringarLit, { backgroundColor: '#e74c3c' }]} /><Text style={styles.skýringarTekst}>Stígur niður</Text></View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tilbaka: { color: '#1D9E75', fontSize: 16 },
  titill: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deild: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  innihald: { flex: 1, paddingHorizontal: 12 },
  miðja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  villaTekst: { color: '#e74c3c', fontSize: 14 },
  reyndurAftur: { backgroundColor: '#1D9E75', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  reyndurAfturTekst: { color: '#fff', fontSize: 14, fontWeight: '600' },
  hausRöð: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, marginBottom: 4 },
  hausTekst: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' },
  hausDálkur: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600', width: 36, textAlign: 'center' },
  röð: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, marginBottom: 2 },
  röðDökkur: { backgroundColor: 'rgba(255,255,255,0.03)' },
  sætiTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 13, width: 28, fontWeight: '500' },
  efstSæti: { color: '#1D9E75', fontWeight: '700' },
  neðstSæti: { color: '#e74c3c' },
  splitLína: { height: 2, backgroundColor: 'rgba(29,158,117,0.2)', marginVertical: 4, marginHorizontal: 10 },
  liðInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  liðLógó: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  liðStafur: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' },
  liðNafn: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1 },
  dálkur: { color: 'rgba(255,255,255,0.6)', fontSize: 11, width: 36, textAlign: 'center' },
  stigDálkur: { color: '#1D9E75', fontSize: 13, fontWeight: '700', width: 36, textAlign: 'center' },
  skýringar: { paddingVertical: 16, paddingHorizontal: 10, gap: 6 },
  skýring: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skýringarLit: { width: 10, height: 10, borderRadius: 5 },
  skýringarTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});