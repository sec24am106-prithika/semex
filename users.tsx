import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@/constants/Colors';
import { API } from '@/services/api';
import { Shield, ShieldOff, User } from 'lucide-react-native';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Network Access</Text>
        <Text style={styles.subtitle}>Actively monitor and manage roles across the Semex ecosystem.</Text>
      </View>

      {users.map((u) => (
        <View key={u.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <User size={20} color={Colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{u.name}</Text>
              <Text style={styles.meta}>{u.role} • {u.phone}</Text>
            </View>
            <View style={styles.statusBox}>
              {u.isActive ? <Shield size={20} color={Colors.success} /> : <ShieldOff size={20} color={Colors.danger} />}
              <Text style={[styles.statusTxt, { color: u.isActive ? Colors.success : Colors.danger }]}>
                {u.isActive ? "Active" : "Blocked"}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textMuted },
  card: { backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 16, ...Shadows.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { backgroundColor: Colors.primaryLight, padding: 12, borderRadius: 24 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  meta: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  statusBox: { alignItems: 'center', gap: 4 },
  statusTxt: { fontSize: 10, fontWeight: 'bold' }
});
