import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Colors, Shadows } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { API } from '@/services/api';
import {
  ShieldCheck,
  Users,
  UserCheck,
  HelpCircle,
  Store,
  CheckSquare,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react-native';

export default function AdminOverviewScreen() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setMetrics(res.data.metrics);
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primaryLight} />
        <Text style={{ color: Colors.textMuted, marginTop: 12 }}>Loading System Admin Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primaryLight} />}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>System Administration</Text>
        <Text style={styles.userName}>{user?.name || 'Super Admin'}</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Users size={20} color={Colors.primaryLight} />
            <Text style={styles.metricVal}>{metrics?.farmersCount || 0}</Text>
            <Text style={styles.metricLab}>Farmers</Text>
          </View>
          <View style={styles.metricCard}>
            <UserCheck size={20} color={Colors.accent} />
            <Text style={styles.metricVal}>{metrics?.expertsCount || 0}</Text>
            <Text style={styles.metricLab}>Experts</Text>
          </View>
          <View style={styles.metricCard}>
            <ShieldCheck size={20} color={Colors.success} />
            <Text style={styles.metricVal}>{metrics?.volunteersCount || 0}</Text>
            <Text style={styles.metricLab}>Volunteers</Text>
          </View>
          <View style={styles.metricCard}>
            <Store size={20} color="#3B82F6" />
            <Text style={styles.metricVal}>{metrics?.customersCount || 0}</Text>
            <Text style={styles.metricLab}>Customers</Text>
          </View>
        </View>
      </View>

      {/* Action Banners */}
      <Text style={styles.sectionTitle}>Verification & Audit Queue</Text>

      <TouchableOpacity style={styles.queueBanner} onPress={() => router.push('/(admin)/approve' as any)}>
        <View style={styles.queueIconBox}>
          <CheckSquare size={24} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.queueTitle}>Pending Verification Queue</Text>
          <Text style={styles.queueSub}>
            {metrics?.pendingExpertVerifications || 0} Experts & {metrics?.pendingVolunteerVerifications || 0} Volunteers awaiting document review
          </Text>
        </View>
        <ChevronRight color={Colors.textMuted} size={20} />
      </TouchableOpacity>

      {/* Quick Ecosystem Counters */}
      <View style={styles.countersCard}>
        <Text style={styles.countersTitle}>Live Ecosystem Activity</Text>
        
        <View style={styles.counterRow}>
          <HelpCircle size={18} color={Colors.accent} />
          <Text style={styles.counterLab}>Open Farmer Consultations</Text>
          <Text style={styles.counterVal}>{metrics?.openFarmerQueries || 0}</Text>
        </View>

        <View style={styles.counterRow}>
          <Store size={18} color={Colors.success} />
          <Text style={styles.counterLab}>Active Marketplace Listings</Text>
          <Text style={styles.counterVal}>{metrics?.activeMarketplaceListings || 0}</Text>
        </View>

        <View style={styles.counterRow}>
          <Award size={18} color={Colors.primaryLight} />
          <Text style={styles.counterLab}>Global Leaderboard Status</Text>
          <Text style={[styles.counterVal, { color: Colors.success }]}>Online</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={Colors.danger} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },

  headerCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, ...Shadows.sm },
  greeting: { fontSize: 13, color: Colors.textMuted },
  userName: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', backgroundColor: Colors.background, padding: 14, borderRadius: 14, alignItems: 'center' },
  metricVal: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginTop: 4 },
  metricLab: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 8 },
  queueBanner: { backgroundColor: Colors.surface, padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 14, borderLeftWidth: 4, borderLeftColor: Colors.accent, ...Shadows.sm },
  queueIconBox: { backgroundColor: Colors.accent, padding: 12, borderRadius: 14 },
  queueTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  queueSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  countersCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 18, gap: 12, ...Shadows.sm },
  countersTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.background, padding: 12, borderRadius: 12 },
  counterLab: { fontSize: 13, color: Colors.text, flex: 1 },
  counterVal: { fontSize: 14, fontWeight: 'bold', color: Colors.text },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, gap: 8, borderWidth: 1, borderColor: Colors.danger },
  logoutText: { color: Colors.danger, fontWeight: 'bold', fontSize: 15 }
});
