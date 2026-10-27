import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking
} from 'react-native';
import { Colors, Shadows } from '@/constants/Colors';
import { API } from '@/services/api';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, FileText, GraduationCap, Award, UserCheck } from 'lucide-react-native';

export default function AdminApproveScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await API.get('/admin/verification-queue');
      setData(res.data);
    } catch (err) {
      console.error("Failed to load verification queue:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchQueue();
  };

  const handleVerifyExpert = async (expertProfileId: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION') => {
    setProcessingId(expertProfileId);
    try {
      const res = await API.post('/admin/verify-expert', {
        expertProfileId,
        action,
        notes: `Admin processed action: ${action}`
      });
      Alert.alert("Decision Recorded", res.data.message);
      fetchQueue();
    } catch (err) {
      Alert.alert("Error", "Failed to update verification status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyVolunteer = async (volunteerProfileId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(volunteerProfileId);
    try {
      const res = await API.post('/admin/verify-volunteer', {
        volunteerProfileId,
        action,
        notes: `Admin processed action: ${action}`
      });
      Alert.alert("Decision Recorded", res.data.message);
      fetchQueue();
    } catch (err) {
      Alert.alert("Error", "Failed to update verification status.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primaryLight} />
        <Text style={{ color: Colors.textMuted, marginTop: 12 }}>Loading Verification Queue...</Text>
      </View>
    );
  }

  const experts = data?.pendingExperts || [];
  const volunteers = data?.pendingVolunteers || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primaryLight} />}
    >
      <View style={styles.heroHeader}>
        <UserCheck size={36} color={Colors.primaryLight} />
        <Text style={styles.heroTitle}>Verification Approval Queue</Text>
        <Text style={styles.heroSub}>Review uploaded qualifications, degrees, and identity proof prior to granting platform authorization.</Text>
      </View>

      {/* PENDING EXPERTS SECTION */}
      <Text style={styles.sectionHeader}>Expert Verification Queue ({experts.length})</Text>

      {experts.length === 0 ? (
        <View style={styles.emptyCard}>
          <CheckCircle2 size={40} color={Colors.success} />
          <Text style={styles.emptyTxt}>No pending expert verification requests.</Text>
        </View>
      ) : (
        experts.map((exp: any) => (
          <View key={exp.id} style={styles.profileCard}>
            {/* Header */}
            <View style={styles.profileHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{exp.name}</Text>
                <Text style={styles.profileTitle}>{exp.title} • {exp.specialization}</Text>
                <Text style={styles.profileOrg}>🏛️ {exp.organization} (Reg: {exp.regNumber})</Text>
              </View>
              <View style={[styles.statusBadge, exp.isApproved && styles.statusBadgeVerified]}>
                <Text style={styles.statusBadgeTxt}>{exp.verificationStatus}</Text>
              </View>
            </View>

            {/* Education Info */}
            {exp.education && exp.education.length > 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxHeader}>Educational Qualifications:</Text>
                {exp.education.map((edu: any, i: number) => (
                  <View key={i} style={styles.eduRow}>
                    <GraduationCap size={14} color={Colors.primaryLight} />
                    <Text style={styles.eduTxt}>{edu.degree} — {edu.institution} ({edu.yearCompleted || '2021'})</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Verification Documents */}
            {exp.verificationDocs && exp.verificationDocs.length > 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxHeader}>Submitted Qualification Proofs:</Text>
                {exp.verificationDocs.map((doc: any, i: number) => (
                  <View key={i} style={styles.docRow}>
                    <FileText size={14} color={Colors.accent} />
                    <Text style={styles.docTxt}>{doc.title} ({doc.docType})</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Verification Action Buttons */}
            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleVerifyExpert(exp.id, 'APPROVE')}
                disabled={processingId === exp.id}
              >
                <CheckCircle2 size={16} color="#fff" />
                <Text style={styles.actionBtnTxt}>Approve & Verify</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.correctBtn}
                onPress={() => handleVerifyExpert(exp.id, 'REQUEST_CORRECTION')}
                disabled={processingId === exp.id}
              >
                <AlertCircle size={16} color="#000" />
                <Text style={[styles.actionBtnTxt, { color: '#000' }]}>Need Correction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleVerifyExpert(exp.id, 'REJECT')}
                disabled={processingId === exp.id}
              >
                <XCircle size={16} color="#fff" />
                <Text style={styles.actionBtnTxt}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* PENDING VOLUNTEERS SECTION */}
      <Text style={styles.sectionHeader}>Volunteer Verification Queue ({volunteers.length})</Text>

      {volunteers.length === 0 ? (
        <View style={styles.emptyCard}>
          <CheckCircle2 size={40} color={Colors.success} />
          <Text style={styles.emptyTxt}>No pending volunteer verification requests.</Text>
        </View>
      ) : (
        volunteers.map((vol: any) => (
          <View key={vol.id} style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{vol.name}</Text>
                <Text style={styles.profileTitle}>{vol.role}</Text>
                <Text style={styles.profileOrg}>🤝 NGO: {vol.orgName} • Areas: {vol.areasSupported}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeTxt}>{vol.verificationStatus}</Text>
              </View>
            </View>

            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleVerifyVolunteer(vol.id, 'APPROVE')}
                disabled={processingId === vol.id}
              >
                <CheckCircle2 size={16} color="#fff" />
                <Text style={styles.actionBtnTxt}>Approve Volunteer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleVerifyVolunteer(vol.id, 'REJECT')}
                disabled={processingId === vol.id}
              >
                <XCircle size={16} color="#fff" />
                <Text style={styles.actionBtnTxt}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },

  heroHeader: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, alignItems: 'center', ...Shadows.sm },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginTop: 10 },
  heroSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 18 },

  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 8 },

  emptyCard: { backgroundColor: Colors.surface, padding: 24, borderRadius: 18, alignItems: 'center' },
  emptyTxt: { color: Colors.textMuted, marginTop: 8, fontSize: 13 },

  profileCard: { backgroundColor: Colors.surface, padding: 18, borderRadius: 20, ...Shadows.sm, gap: 12 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  profileName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  profileTitle: { fontSize: 13, color: Colors.primaryLight, marginTop: 2 },
  profileOrg: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: Colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeVerified: { backgroundColor: Colors.success },
  statusBadgeTxt: { fontSize: 11, fontWeight: 'bold', color: '#fff' },

  infoBox: { backgroundColor: Colors.background, padding: 12, borderRadius: 12, gap: 6 },
  infoBoxHeader: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted },
  eduRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eduTxt: { fontSize: 12, color: Colors.text, flex: 1 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  docTxt: { fontSize: 12, color: Colors.accent, flex: 1, fontWeight: '500' },

  actionBtnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  approveBtn: { flex: 1, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 4 },
  correctBtn: { flex: 1, backgroundColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 4 },
  rejectBtn: { backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 4 },
  actionBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
