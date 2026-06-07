import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function LeikurScreen({ leikur, onTilbaka }) {
  const atburðir = [
    { mín: "12'", tegund: '⚽', lið: 'heima', leikmað: 'G. Sigurðsson' },
    { mín: "34'", tegund: '🟨', lið: 'gestir', leikmað: 'B. Kristjánsson' },
    { mín: "67'", tegund: '⚽', lið: 'gestir', leikmað: 'H. Jónsson' },
    { mín: "78'", tegund: '⚽', lið: 'heima', leikmað: 'A. Gunnarsson' },
  ];

  const tölfræði = [
    { heiti: 'Skot', heima: 8, gestir: 5 },
    { heiti: 'Skot á mark', heima: 4, gestir: 2 },
    { heiti: 'Horn', heima: 6, gestir: 3 },
    { heiti: 'Fælur', heima: 12, gestir: 15 },
    { heiti: 'Gular spjöld', heima: 1, gestir: 2 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onTilbaka}>
          <Text style={styles.tilbaka}>← Til baka</Text>
        </TouchableOpacity>
        <Text style={styles.deildNafn}>{leikur.deild}</Text>
      </View>

      <ScrollView style={styles.innihald}>
        {/* Stigakort */}
        <View style={styles.stigaKort}>
          <Text style={styles.stöðuTexti}>
            {leikur.staða === 'live' ? `● ${leikur.tími}` : leikur.tími}
          </Text>
          <View style={styles.liðirRow}>
            <Text style={styles.liðNafn}>{leikur.heima}</Text>
            <Text style={styles.stig}>
              {leikur.staða === 'óleikinn'
                ? leikur.tími
                : `${leikur.heimaStig} – ${leikur.gestaStig}`}
            </Text>
            <Text style={styles.liðNafn}>{leikur.gestir}</Text>
          </View>
        </View>

        {/* Atburðir */}
        <Text style={styles.kaflaHeiti}>Atburðir</Text>
        <View style={styles.atburðaKort}>
          {atburðir.map((a, i) => (
            <View key={i} style={styles.atburður}>
              {a.lið === 'heima' ? (
                <>
                  <Text style={styles.atburðurHeima}>{a.leikmað} {a.tegund}</Text>
                  <Text style={styles.atburðurMín}>{a.mín}</Text>
                  <Text style={styles.atburðurTómt} />
                </>
              ) : (
                <>
                  <Text style={styles.atburðurTómt} />
                  <Text style={styles.atburðurMín}>{a.mín}</Text>
                  <Text style={styles.atburðurGestir}>{a.tegund} {a.leikmað}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Tölfræði */}
        <Text style={styles.kaflaHeiti}>Tölfræði</Text>
        <View style={styles.tölfræðiKort}>
          {tölfræði.map((t, i) => {
            const samtals = t.heima + t.gestir;
            const heimaPr = samtals > 0 ? t.heima / samtals : 0.5;
            const gestirPr = samtals > 0 ? t.gestir / samtals : 0.5;
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

  stigaKort: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  stöðuTexti: { color: '#1D9E75', fontSize: 12, fontWeight: '600', marginBottom: 12 },
  liðirRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  liðNafn: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'center' },
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
  tölfræðiTala: { color: '#fff', fontSize: 14, fontWeight: '600', width: 30, textAlign: 'center' },
  tölfræðiMiðja: { flex: 1, paddingHorizontal: 12 },
  tölfræðiHeiti: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center', marginBottom: 5 },
  stikuContainer: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' },
  stikuHeima: { backgroundColor: '#1D9E75' },
  stikuGestir: { backgroundColor: 'rgba(255,255,255,0.25)' },
});