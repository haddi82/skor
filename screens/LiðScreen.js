import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sækjaLið } from '../data/api';
import LeikmaðurScreen from './LeikmaðurScreen';

const STÖÐUR = {
  'Goalkeeper': 'Markvörður',
  'Defender': 'Varnarmenn',
  'Midfielder': 'Miðjumenn',
  'Attacker': 'Framherjar',
};

const STÖÐUR_RÖÐ = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

export default function LiðScreen({ lið, onTilbaka }) {
  const [leikmenn, setLeikmenn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [valinnLeikmaður, setValinnLeikmaður] = useState(null);

  useEffect(() => {
    async function hlaða() {
      try {
        const gögn = await sækjaLið(lið.id);
        setLeikmenn(gögn);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    hlaða();
  }, [lið.id]);

  const flokkað = STÖÐUR_RÖÐ.map(staða => ({
    staða,
    nafn: STÖÐUR[staða],
    leikmenn: leikmenn.filter(l => l.position === staða).sort((a, b) => (a.number || 99) - (b.number || 99)),
  })).filter(f => f.leikmenn.length > 0);

  if (valinnLeikmaður) {
    return <LeikmaðurScreen leikmaður={valinnLeikmaður} onTilbaka={() => setValinnLeikmaður(null)} />;
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.haus}>
        <TouchableOpacity onPress={onTilbaka} style={s.tilbakaHnappur}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={s.liðLógó}>
          <Text style={s.liðStafur}>{lið.nafn[0]}</Text>
        </View>
        <Text style={s.liðNafn}>{lið.nafn}</Text>
      </View>

      <View style={s.tölfræðiBar}>
        <View style={s.tölfræðiKort}>
          <Text style={s.tölfræðiTala}>{lið.leikir}</Text>
          <Text style={s.tölfræðiLabel}>Leikir</Text>
        </View>
        <View style={s.tölfræðiKort}>
          <Text style={s.tölfræðiTala}>{lið.sigrar}</Text>
          <Text style={s.tölfræðiLabel}>Sigrar</Text>
        </View>
        <View style={s.tölfræðiKort}>
          <Text style={s.tölfræðiTala}>{lið.jafntefli}</Text>
          <Text style={s.tölfræðiLabel}>Jafntefli</Text>
        </View>
        <View style={s.tölfræðiKort}>
          <Text style={s.tölfræðiTala}>{lið.tap}</Text>
          <Text style={s.tölfræðiLabel}>Tap</Text>
        </View>
        <View style={s.tölfræðiKort}>
          <Text style={[s.tölfræðiTala, { color: '#1D9E75' }]}>{lið.stig}</Text>
          <Text style={s.tölfræðiLabel}>Stig</Text>
        </View>
      </View>

      {loading ? (
        <View style={s.miðja}>
          <ActivityIndicator size="large" color="#1D9E75" />
          <Text style={s.loadingTekst}>Sæki leikmenn...</Text>
        </View>
      ) : (
        <ScrollView style={s.innihald}>
          <Text style={s.hlutaFyrirsögn}>Leikmenn</Text>
          {flokkað.map(flokkur => (
            <View key={flokkur.staða} style={s.flokkur}>
              <Text style={s.flokkurHeiti}>{flokkur.nafn}</Text>
              {flokkur.leikmenn.map(leikmaður => (
                <TouchableOpacity key={leikmaður.id} onPress={() => setValinnLeikmaður(leikmaður)}>
                  <View style={s.leikmaðurRöð}>
                    <Text style={s.númer}>{leikmaður.number || '—'}</Text>
                    <View style={s.leikmaðurLógó}>
                      <Text style={s.leikmaðurStafur}>{leikmaður.name[0]}</Text>
                    </View>
                    <Text style={s.leikmaðurNafn}>{leikmaður.name}</Text>
                    <Text style={s.aldur}>{leikmaður.age} ára</Text>
                    <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.2)" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  haus: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  tilbakaHnappur: { padding: 4 },
  liðLógó: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  liðStafur: { color: '#fff', fontSize: 16, fontWeight: '700' },
  liðNafn: { color: '#fff', fontSize: 18, fontWeight: '600', flex: 1 },
  tölfræðiBar: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  tölfræðiKort: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, alignItems: 'center' },
  tölfræðiTala: { color: '#fff', fontSize: 18, fontWeight: '700' },
  tölfræðiLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 },
  innihald: { flex: 1, paddingHorizontal: 12 },
  miðja: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingTekst: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  hlutaFyrirsögn: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingTop: 8, paddingBottom: 12 },
  flokkur: { marginBottom: 16 },
  flokkurHeiti: { color: '#1D9E75', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingLeft: 4 },
  leikmaðurRöð: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.06)' },
  númer: { color: 'rgba(255,255,255,0.3)', fontSize: 13, width: 24, textAlign: 'center' },
  leikmaðurLógó: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  leikmaðurStafur: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  leikmaðurNafn: { color: '#fff', fontSize: 14, fontWeight: '500', flex: 1 },
  aldur: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
});