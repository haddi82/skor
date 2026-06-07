import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function LeikurScreen({ route, navigation }) {
  const { leikur } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.tilbaka}>
          <Text style={styles.tilbakaTekst}>← Til baka</Text>
        </TouchableOpacity>
        <Text style={styles.deild}>{leikur.deild}</Text>
      </View>

      <ScrollView style={styles.innihald}>
        <View style={styles.stigaKort}>
          <View style={[styles.stöðuMerki, leikur.staða === 'live' ? styles.liveMerki : styles.lokiðMerki]}>
            <Text style={[styles.stöðuTekst, leikur.staða === 'live' ? styles.liveTekst : styles.lokiðTekst]}>
              {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.tími}
            </Text>
          </View>

          <View style={styles.liðirOgStig}>
            <View style={styles.liðBox}>
              <View style={styles.liðLógóStór}><Text style={styles.liðStafurStór}>{leikur.heima[0]}</Text></View>
              <Text style={styles.liðNafnStór}>{leikur.heima}</Text>
            </View>

            <View style={styles.stigaBox}>
              {leikur.staða === 'óleikinn' ? (
                <Text style={styles.tímiStór}>{leikur.tími}</Text>
              ) : (
                <Text style={styles.stigStór}>{leikur.heimaStig} – {leikur.gestaStig}</Text>
              )}
            </View>

            <View style={[styles.liðBox, styles.liðBoxHægri]}>
              <View style={styles.liðLógóStór}><Text style={styles.liðStafurStór}>{leikur.gestir[0]}</Text></View>
              <Text style={[styles.liðNafnStór, {textAlign:'center'}]}>{leikur.gestir}</Text>
            </View>
          </View>
        </View>

        <View style={styles.upplýsingaKort}>
          <Text style={styles.kortFyrirsögn}>Leikupplýsingar</Text>
          <View style={styles.röð}>
            <Text style={styles.merkiNafn}>Deild</Text>
            <Text style={styles.merkiGildi}>{leikur.deild}</Text>
          </View>
          <View style={styles.röð}>
            <Text style={styles.merkiNafn}>Staða</Text>
            <Text style={styles.merkiGildi}>{leikur.staða === 'live' ? 'Í gangi' : leikur.staða === 'lokið' ? 'Lokið' : 'Óleikinn'}</Text>
          </View>
          {leikur.staða !== 'óleikinn' && (
            <>
              <View style={styles.röð}>
                <Text style={styles.merkiNafn}>{leikur.heima}</Text>
                <Text style={styles.merkiGildi}>{leikur.heimaStig}</Text>
              </View>
              <View style={styles.röð}>
                <Text style={styles.merkiNafn}>{leikur.gestir}</Text>
                <Text style={styles.merkiGildi}>{leikur.gestaStig}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  tilbaka: { padding: 4 },
  tilbakaTekst: { color: '#1D9E75', fontSize: 16 },
  deild: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  innihald: { flex: 1, paddingHorizontal: 16 },
  stigaKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center' },
  stöðuMerki: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 20 },
  liveMerki: { backgroundColor: 'rgba(29,158,117,0.2)' },
  lokiðMerki: { backgroundColor: 'rgba(255,255,255,0.08)' },
  stöðuTekst: { fontSize: 13 },
  liveTekst: { color: '#1D9E75', fontWeight: '600' },
  lokiðTekst: { color: 'rgba(255,255,255,0.4)' },
  liðirOgStig: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
  liðBox: { alignItems: 'center', flex: 1 },
  liðBoxHægri: { alignItems: 'center' },
  liðLógóStór: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  liðStafurStór: { color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: '600' },
  liðNafnStór: { color: '#fff', fontSize: 14, fontWeight: '500' },
  stigaBox: { flex: 1, alignItems: 'center' },
  stigStór: { color: '#fff', fontSize: 36, fontWeight: '700', letterSpacing: 2 },
  tímiStór: { color: 'rgba(255,255,255,0.5)', fontSize: 24 },
  upplýsingaKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16 },
  kortFyrirsögn: { color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
  röð: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.06)' },
  merkiNafn: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  merkiGildi: { color: '#fff', fontSize: 14, fontWeight: '500' },
});