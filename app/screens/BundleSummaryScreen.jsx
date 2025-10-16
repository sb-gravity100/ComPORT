import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BundleSummaryScreen({ route }) {
   const { bundleData } = route.params || {};

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Bundle Summary</Text>
         {/* TODO: Show selected parts, total price, ComfortProfileChart */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
