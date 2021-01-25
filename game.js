import './src/libs/weapp-adapter';
window.DOMParser = require('./src/libs/dom-parser.min');

document.documentElement.appendChild = function () { };
document.documentElement.removeChild = function () { };

import Main from './src/Main';

new Main();