import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductCatalogScreen() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Browse PC Parts</Text>
         {/* TODO: Add category filters, search bar, and PartCard list */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 30 },
   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
