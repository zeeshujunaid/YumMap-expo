module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // ✅ Must be last in plugins array
      // You can add more plugins below if needed
      // Example:
      // ['module-resolver', {
      //   root: ['./src'],
      //   alias: {
      //     components: './src/components',
      //     screens: './src/screens',
      //   },
      // }],
    ],
  };
};
