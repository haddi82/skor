import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STÖÐUR = {
  'Goalkeeper': 'Markvörður',
  'Defender': 'Varnarmaður',
  'Midfielder': 'Miðjumaður',
  'Attacker': 'Framherji',
};

export default function LeikmaðurScreen({ leikmaður, onTilbaka }) {
  const [myndVilla, setMyndVilla] = useState(false);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.haus}>
        <TouchableOpacity onPress={onTilbaka} style={s.tilbakaHnappur}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.hausTitill}>Leikmaður</Text>
      </View>

      <ScrollView style={s.innihald}>
        {/* Mynd og nafn */}
        <View style={s.prófíll}>
          {!myndVilla && leikmaður.photo ? (
            <Image
              source={{ uri: leikmaður.photo }}
              style={s.mynd}
              onError={() => setMyndVilla(true)}
            />
          ) : (
            <View style={s.myndStaðgengill}>
              <Text style={s.myndStafur}>{leikmaður.name[0]}</Text>
            </View>
          )}
          <Text style={s.nafn}>{leikmaður.name}</Text>
          <Text style={s.staða}>{STÖÐUR[leikmaður.position] || leikmaður.position}</Text>
        </View>

        {/* Upplýsingar */}
        <View style={s.kortGrid}>
          <View style={s.kort}>
            <Text style={s.kortTala}>{leikmaður.number || '—'}</Text>
            <Text style={s.kortLabel}>Númer</Text>
          </View>
          <View style={s.kort}>
            <Text style={s.kortTala}>{leikmaður.age || '—'}</Text>
            <Text style={s.kortLabel}>Aldur</Text>
          </View>
          <View style={s.kort}>
            <Text style={s.kortTala}>{leikmaður.nationality || '—'}</Text>
            <Text style={s.kortLabel}>Þjóðerni</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f18' },
  haus: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  tilbakaHnappur: { padding: 4 },
  hausTitill: { color: '#fff', fontSize: 16, fontWeight: '600' },
  innihald: { flex: 1 },
  prófíll: { alignItems: 'center', paddingVertical: 32 },
  mynd: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  myndStaðgengill: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  myndStafur: { color: '#fff', fontSize: 40, fontWeight: '700' },
  nafn: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 6 },
  staða: { color: '#1D9E75', fontSize: 14, fontWeight: '500' },
  kortGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  kort: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, alignItems: 'center' },
  kortTala: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  kortLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
});