/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {PokoWidgetProvider} from '@pokopayment/react-native-sdk';
import React from 'react';
import Demo from './Demo';

function App(): JSX.Element {
  return (
    <PokoWidgetProvider>
      <Demo />
    </PokoWidgetProvider>
  );
}

export default App;
