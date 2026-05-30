module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/Fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // iOS auto-link karega
      },
    },
  },
};