var path = require('path');
var root = path.join(__dirname, '..');

module.exports = {
    root: root,
    appRoot: path.join(root, './'),
    site: {
        name: 'PennBook',
        subtitle: 'NETS 212 - Final Project'
    },
    cookieSecret: 'secret'
};

