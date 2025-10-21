// app/components/ProductDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import {
   Modal,
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ScrollView,
   StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { toTitleCaseWithAcronyms } from '../utils/common';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const SCHEMA_MAP = {
   CPU: [
      'socket',
      'architecture',
      'coreCount',
      'threadCount',
      'baseClock',
      'boostClock',
      'integratedGraphics',
      'tdp',
   ],
   GPU: [
      'gpuChip',
      'cudaCores',
      'vram',
      'vramType',
      'busWidth',
      'tdp',
      'powerConnector',
   ],
   RAM: ['memoryType', 'capacity', 'modules', 'speed', 'latency', 'voltage'],
   Motherboard: [
      'chipset',
      'socket',
      'formFactor',
      'memoryType',
      'memorySpeed',
      'maxMemory',
   ],
   Storage: [
      'driveType',
      'interface',
      'capacity',
      'readSpeed',
      'writeSpeed',
      'formFactor',
   ],
   PSU: ['wattage', 'efficiencyRating', 'modularity', 'fanSize', 'formFactor'],
   Case: [
      'formFactor',
      'material',
      'motherboardSupport',
      'radiatorSupport',
      'fanSupport',
   ],
};

export default function ProductDetailsModal({
   visible,
   onClose,
   category,
   specs,
   descriptions,
   onSave,
}) {
   const { theme } = useTheme();
   const { colors } = theme;

   const [specInputs, setSpecInputs] = useState({});
   const [descInputs, setDescInputs] = useState([]);

   useEffect(() => {
      setSpecInputs(specs || {});
      setDescInputs(descriptions || []);
   }, [visible]);

   useFocusEffect(
      React.useCallback(() => {
         const onBackPress = () => {
            if (visible) {
               onClose();
               return true; // Prevent default behavior
            }
            return false; // Allow default behavior
         };
         const r = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
         );

         return () => r.remove(); // Clean up the event listener on unmount or when dependencies change
      }, [visible, onClose])
   );

   const handleSave = () => {
      onSave(specInputs, descInputs);
      onClose();
   };

   const specFields = SCHEMA_MAP[category] || [];

   return (
      <Modal visible={visible} animationType="slide">
         <ScrollView
            style={[
               styles.modalContainer,
               { backgroundColor: colors.background, paddingBottom: 100 },
            ]}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  Edit Specifications & Descriptions
               </Text>
               <TouchableOpacity onPress={onClose}>
                  <MaterialIcons
                     name="close"
                     size={24}
                     color={colors.textPrimary}
                  />
               </TouchableOpacity>
            </View>

            <Text
               style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
               Specifications
            </Text>
            {specFields.map((field) => (
               <View key={field} style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     {toTitleCaseWithAcronyms(field)}
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={specInputs[field]?.toString() || ''}
                     onChangeText={(text) =>
                        setSpecInputs({ ...specInputs, [field]: text })
                     }
                     placeholder={`Enter ${toTitleCaseWithAcronyms(field)}`}
                     placeholderTextColor={colors.textMuted}
                  />
               </View>
            ))}

            <Text
               style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
               Descriptions
            </Text>
            {descInputs.map((desc, index) => (
               <View key={index} style={styles.descriptionRow}>
                  <View style={{ flex: 1 }}>
                     <TextInput
                        style={[
                           styles.input,
                           {
                              backgroundColor: colors.bgTertiary,
                              color: colors.textPrimary,
                              marginBottom: 4,
                           },
                        ]}
                        value={desc.name}
                        onChangeText={(text) => {
                           const updated = [...descInputs];
                           updated[index].name = text;
                           setDescInputs(updated);
                        }}
                        placeholder="Label"
                        placeholderTextColor={colors.textMuted}
                     />
                     <TextInput
                        style={[
                           styles.input,
                           {
                              backgroundColor: colors.bgTertiary,
                              color: colors.textPrimary,
                           },
                        ]}
                        value={desc.description}
                        onChangeText={(text) => {
                           const updated = [...descInputs];
                           updated[index].description = text;
                           setDescInputs(updated);
                        }}
                        placeholder="Description"
                        placeholderTextColor={colors.textMuted}
                     />
                  </View>
                  <TouchableOpacity
                     onPress={() => {
                        const updated = descInputs.filter(
                           (_, i) => i !== index
                        );
                        setDescInputs(updated);
                     }}
                     style={styles.removeButton}
                  >
                     <MaterialIcons
                        name="close"
                        size={30}
                        color={colors.error}
                     />
                  </TouchableOpacity>
               </View>
            ))}

            <TouchableOpacity
               style={[styles.addButton, { backgroundColor: colors.primary }]}
               onPress={() =>
                  setDescInputs([...descInputs, { name: '', description: '' }])
               }
            >
               <Text style={{ color: colors.textDark }}>Add Description</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.saveButton, { backgroundColor: colors.primary }]}
               onPress={handleSave}
            >
               <Text style={{ color: colors.textDark }}>Save</Text>
            </TouchableOpacity>
         </ScrollView>
      </Modal>
   );
}

const styles = StyleSheet.create({
   modalContainer: { padding: 16 },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
   },
   title: { fontSize: 18, fontWeight: '700' },
   sectionLabel: { fontSize: 16, fontWeight: '600', marginTop: 16 },
   inputGroup: { marginBottom: 5 },
   label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
   input: { borderRadius: 12, padding: 10, fontSize: 15 },
   addButton: {
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 12,
   },
   saveButton: {
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 10,
   },
   descriptionRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 5,
   },
   removeButton: {
      padding: 0,
      marginTop: 22,
   },
});
