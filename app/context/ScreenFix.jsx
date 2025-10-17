import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';

const ScreenFix = ({ children }) => {
   const { height } = useWindowDimensions();
   return (
      <View
         style={{
            height,
         }}
      >
         {children}
      </View>
   );
};

export default ScreenFix;
