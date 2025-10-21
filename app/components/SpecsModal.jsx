import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Modal,
   ScrollView,
   Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { createReview } from '../services/api';
import { toTitleCaseWithAcronyms } from '../utils/common';

export default function SpecsModal({ visible, onClose, product }) {
   const { theme } = useTheme();
   const { colors } = theme;

   return (
      <Modal
         visible={visible}
         animationType="slide"
         transparent={true}
         onRequestClose={onClose}
      >
         <View style={styles.overlay}>
            <View
               style={[styles.container, { backgroundColor: colors.bgPrimary }]}
            >
               <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                     Specifications
                  </Text>
                  <TouchableOpacity
                     onPress={onClose}
                     style={[
                        styles.closeButton,
                        { backgroundColor: colors.surface },
                     ]}
                  >
                     <MaterialIcons
                        name="close"
                        size={24}
                        color={colors.textPrimary}
                     />
                  </TouchableOpacity>
               </View>

               <ScrollView
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
               >
                  {Object.entries(product.specifications).map(
                     ([key, value]) => (
                        <View key={key} style={styles.specRow}>
                           <Text
                              style={[
                                 styles.specKey,
                                 { color: colors.textSecondary },
                              ]}
                           >
                              {toTitleCaseWithAcronyms(key)}
                           </Text>
                           <Text
                              style={[
                                 styles.specValue,
                                 { color: colors.textPrimary },
                              ]}
                           >
                              {value}
                           </Text>
                        </View>
                     )
                  )}
               </ScrollView>
            </View>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   container: {
      //   height: '90%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
   },
   title: {
      fontSize: 22,
      fontWeight: '800',
   },
   closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   content: {
      padding: 16,
      paddingBottom: 100,
   },
   section: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
   },
   specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
   },
   specKey: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
   },
   specValue: {
      fontSize: 18,
      flex: 1,
      textAlign: 'right',
   },
});
