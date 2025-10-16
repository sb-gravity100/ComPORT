import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>My Profile</Text>
         {/* TODO: Show saved bundles, review history, logout button */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 30 },
   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
