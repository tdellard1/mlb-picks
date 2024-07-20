// cache/memoryCache.js
module.exports = function () {
  const cache = {};
  return {
    get: function (key) { return cache[key]; },
    set: function (key, val) { cache[key] = val; },
    has: function (key) { return cache[key] !== undefined; }
  }
}();
