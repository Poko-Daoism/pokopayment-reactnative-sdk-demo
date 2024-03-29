/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {usePokoWidget} from '@pokopayment/react-native-sdk';
import React, {useCallback, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Switch,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {WebView} from 'react-native-webview';

const STAGING_API_KEY = 'c95f413b-d3b3-42b9-adfa-92d2d0678bb4';
const STAGING_USER_ID = 'user_id_staging_reactnative';
const DEV_API_KEY = '235527a2-be1a-4a2a-b6c0-2d79bff1bfca';
const DEV_USER_ID = 'user_id_dev_reactnative';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <View style={[styles.sectionDescription]}>{children}</View>
    </View>
  );
}

function Demo(): JSX.Element {
  const {launchWidget, setApiKey, setEnv, setUserId} = usePokoWidget();
  const [state, setState] = useState({
    apiKey: STAGING_API_KEY,
    walletAddress: '',
    userId: STAGING_USER_ID,
    isStaging: true,
  });
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleLaunchWidget = useCallback(
    async (params: {
      fiat?: string;
      crypto?: string;
      fiatAmount?: number;
      cryptoAmount?: number;
      strictMode?: boolean;
      fiatList?: string[];
      cryptoList?: string[];
      excludeProviderIds?: string[];
      signature?: string;
      providerId?: string;
      paymentMethodId?: string;
      receiveWalletAddress?: string;
    }) => {
      if (state.apiKey && state.userId) {
        setApiKey(state.apiKey);
        setUserId(state.userId);
        setEnv(state.isStaging ? 'STAGING' : 'DEVELOPMENT');

        const urlLaunched = launchWidget(params);
        console.log('urlLaunched', urlLaunched);
      } else {
        Alert.alert('Error', 'Missing info (apiKey, userId)');
      }
    },
    [launchWidget, setApiKey, setUserId, setEnv, state],
  );

  const handleSwitchMode = (status: boolean) => {
    // prod
    if (status === true) {
      setState({
        ...state,
        isStaging: true,
        walletAddress: '',
        userId: STAGING_USER_ID,
        apiKey: STAGING_API_KEY,
      });
    } else {
      setState({
        ...state,
        isStaging: false,
        walletAddress: '',
        userId: DEV_USER_ID,
        apiKey: DEV_API_KEY,
      });
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View
            style={{
              justifyContent: 'center',
              width: 200,
              flexDirection: 'row',
            }}>
            <Text>Mode: {state.isStaging ? 'STAGING' : 'DEV'}</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={state.isStaging ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleSwitchMode}
              value={state.isStaging}
            />
          </View>

          <Section title="API KEY">
            <TextInput
              placeholder="API KEY"
              onChangeText={newText => setState({...state, apiKey: newText})}
              defaultValue={state.apiKey}
            />
          </Section>
          <Section title="Receive Wallet address">
            <TextInput
              placeholder="wallet address"
              onChangeText={newText =>
                setState({...state, walletAddress: newText})
              }
              defaultValue={state.walletAddress}
            />
          </Section>
          <Section title="User Id">
            <TextInput
              placeholder="user_id"
              onChangeText={newText => setState({...state, userId: newText})}
              defaultValue={state.userId}
            />
          </Section>

          <Section title="Test">
            <View style={{marginBottom: 12}}>
              <Button
                onPress={() =>
                  handleLaunchWidget({
                    fiat: 'USD',
                    crypto: 'USDT-ethereum',
                    fiatAmount: 50,
                    strictMode: true,
                    receiveWalletAddress: state.walletAddress,
                  })
                }
                title="50 USD - USDT (ethereum) - Strict mode"
              />
            </View>

            <View style={{marginBottom: 12}}>
              <Button
                onPress={() =>
                  handleLaunchWidget({
                    fiatList: ['VND', 'USD'],
                    cryptoList: ['USDT-ethereum', 'ETH-ethereum'],
                    receiveWalletAddress: state.walletAddress,
                  })
                }
                title="fiatList, cryptoList"
              />
            </View>

            <View style={{marginBottom: 12}}>
              <Button
                onPress={() =>
                  handleLaunchWidget({
                    excludeProviderIds: ['transak'],
                    receiveWalletAddress: state.walletAddress,
                  })
                }
                title="excludeProviderIds transak"
              />
            </View>

            <View style={{marginBottom: 12}}>
              <Button
                onPress={() =>
                  handleLaunchWidget({
                    fiat: 'VND',
                    crypto: 'ETH-ethereum',
                    fiatAmount: 1000000,
                    providerId: 'transak',
                    paymentMethodId: 'credit_debit_card',
                    receiveWalletAddress: state.walletAddress,
                  })
                }
                title="Direct to transak (card)"
              />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Demo;
