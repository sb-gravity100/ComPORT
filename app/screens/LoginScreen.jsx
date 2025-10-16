import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Login</Text>
         {/* TODO: Add email/password form and auth logic */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
