const path = require('path');

// ----------------------

// Parent folder = project root
const root = path.join(__dirname, '../');
module.exports = {
  root,
  src: path.join(root, 'src'),
  server: path.join(root, 'src', 'server'),
  settings: path.join(root, 'settings'),
  models: path.join(root, 'src', 'models'),
  modules: path.join(root, 'src', 'modules'),
  database: path.join(root, 'src', 'database'),
  controllers: path.join(root, 'src', 'controllers'),
  utils: path.join(root, 'src', 'utils'),
  validators: path.join(root, 'src', 'validators'),
  messages: path.join(root, 'messages'),
  temp: path.join(root, 'temp'),
};

