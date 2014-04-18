/*
	Helper module used to circumvent the require cache and load a new instance of a module at a namespace
 */

function namespacedRequire(id, name) {
  // ensure base module is loaded into cache
  var baseModule = require(id);
  // resolve base cache id
  var baseId = require.resolve(id);
  // check cache for namespaced module
  var namespacedId = namespaceId(baseId, name);
  var namespacedModule = require.cache[namespacedId];
  if (namespacedModule) {
    return namespacedModule.exports;
  }
  // hold reference to base cache entry
  var baseCacheEntries = getCacheEntries(require.cache, baseId);
  // delete base cache entry
  deleteCacheEntries(require.cache, baseCacheEntries);
  // load an new module into cache
  namespacedModule = require(id);
  // hold reference to namespaced cache entry
  var namespacedCacheEntries = getCacheEntries(require.cache, baseId);
  // namespace cache entry
  namespacedCacheEntries = namespaceCacheEntries(namespacedCacheEntries, name);
  // set base and namespaced cache entries to the appropriate keys in the cache
  addCacheEntries(require.cache, baseCacheEntries);
  addCacheEntries(require.cache, namespacedCacheEntries);
  return namespacedModule;
}

function namespaceId(id, name) {
  return id + ':' + name;
}

function getCacheEntries(cache, id) {
  var cacheEntries = [];
  var cacheEntry = cache[id];
  if (typeof cacheEntry === 'undefined') {
    return cacheEntries;
  }
  cacheEntries.push(cacheEntry);
  var children = cacheEntry.children;
  for (var i = 0; i < children.length; i++) {
    var childId = children[i].id;
    cacheEntries = cacheEntries.concat(getCacheEntries(cache, childId));
  }
  return cacheEntries;
}

function namespaceCacheEntries(cacheEntries, namespace) {
  var namespacedCacheEntries = [];
  for (var i = 0; i < cacheEntries.length; i++) {
    var cacheEntry = cacheEntries[i];
    cacheEntry.id = namespaceId(cacheEntry.id, namespace);
    namespacedCacheEntries.push(cacheEntry);
  }
  return namespacedCacheEntries;
}

function deleteCacheEntries(cache, cacheEntries) {
  for (var i = 0; i < cacheEntries.length; i++) {
    var cacheEntry = cacheEntries[i];
    delete cache[cacheEntry.id];
  }
}

function addCacheEntries(cache, cacheEntries) {
  for (var i = 0; i < cacheEntries.length; i++) {
    var cacheEntry = cacheEntries[i];
    cache[cacheEntry.id] = cacheEntry;
  }
}

module.exports = namespacedRequire;