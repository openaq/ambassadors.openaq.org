const csso = require('postcss-csso');
const autoprefixer = require('autoprefixer');


module.exports = {
  plugins: [csso(), autoprefixer()],
};
