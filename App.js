// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './Screen/MainScreen';

function App() {
  return (
    <NavigationContainer>
      <MainScreen />
    </NavigationContainer>
  );
}

export default App;