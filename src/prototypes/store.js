'use strict';

Object.defineProperties(Store.prototype, {
  'resources': {
    get: function() {
      return _.keys(this);
    },
    configurable: true
  }
});
