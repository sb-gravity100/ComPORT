import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PartDetailScreen({ route }) {
   const { partId } = route.params;

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Part Details</Text>
         <Text>Part ID: {partId}</Text>
         {/* TODO: Add ComfortScoreBar, ReviewList, ReviewSubmission */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
