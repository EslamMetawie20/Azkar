const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.
  // React native web is hoisted to root node_modules
  const rnwPath = path.resolve(__dirname, '../../node_modules/react-native-web');

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    // Force resolution to single React version to avoid hooks error
    'react$': path.resolve(__dirname, '../../node_modules/react'),
    'react-dom$': path.resolve(__dirname, '../../node_modules/react-dom'),
    'react-native-web/dist/exports/AppRegistry': path.join(rnwPath, 'dist/exports/AppRegistry'),
    'react-native-web/dist/exports/StyleSheet': path.join(rnwPath, 'dist/exports/StyleSheet'),
    'react-native-web/dist/exports/Text': path.join(rnwPath, 'dist/exports/Text'),
    'react-native-web/dist/exports/View': path.join(rnwPath, 'dist/exports/View'),
    'react-native-web/dist/exports/Image': path.join(rnwPath, 'dist/exports/Image'),
    'react-native-web/dist/exports/ScrollView': path.join(rnwPath, 'dist/exports/ScrollView'),
    'react-native-web/dist/exports/TouchableOpacity': path.join(rnwPath, 'dist/exports/TouchableOpacity'),
    'react-native-web/dist/exports/ActivityIndicator': path.join(rnwPath, 'dist/exports/ActivityIndicator'),
    'react-native-web/dist/exports/Alert': path.join(rnwPath, 'dist/exports/Alert'),
    'react-native-web/dist/exports/I18nManager': path.join(rnwPath, 'dist/exports/I18nManager'),
    'react-native-web/dist/exports/FlatList': path.join(rnwPath, 'dist/exports/FlatList'),
    'react-native-web/dist/exports/Switch': path.join(rnwPath, 'dist/exports/Switch'),
    'react-native-web/dist/exports/Platform': path.join(rnwPath, 'dist/exports/Platform'),
    // Alias expo-linear-gradient to react-native-web View for web compatibility
    'expo-linear-gradient': path.join(rnwPath, 'dist/exports/View'),
  };

  return config;
};