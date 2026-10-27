import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function AdminAssign() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignment Engine</Text>
      <Text style={styles.subtitle}>Cross-matching pending Farm Requests to available Field Volunteers.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textMuted },
});
