module.exports = require('babel-jest').createTransformer({
  presets: ['es2015', 'react-native'],
  plugins: [
    'syntax-class-properties',
    'transform-class-properties',
  ],
})