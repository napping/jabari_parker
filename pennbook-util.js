/* jslint node: true */
/* globals define */
'use strict';

define(['exports'], function (exports) {
  exports.flatten = function (obj) {
    var result = {};
    for (var attr in obj) {
      for (var type in obj[attr]) {
        if (type === 'M') {
          result[attr] = exports.flatten(obj[attr][type]);
        } else {
          result[attr] = obj[attr][type];
        }
      }
    }
    return result;
  };
});
