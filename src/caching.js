export const cache = (keys, func) => {
  let cache = {};
  const innerFunc = () => {
    if (!cache.value) {
      cache['value'] = func();
    }
    return cache.value;
  };

  innerFunc.cacheKeys = keys || [];
  innerFunc.clearCache = () => { cache = {}; };
  Object.defineProperty(innerFunc, 'name', { value: `cached ${func.name}` });
  return innerFunc;
};


export class CachingObject {

  constructor() {
    this.invalidateAllCaches = this.invalidateAllCaches.bind(this);
    this.invalidateCacheFor = this.invalidateCacheFor.bind(this);
  }

  caches() {
    const caches = [];

    Object.keys(this).forEach(
      (key) => {
        if (typeof(this[key].cacheKeys) !== 'undefined') {
          caches.push(this[key]);
        }
      }
    );

    return caches;
  }

  invalidateCacheFor(...keys) {
    this.caches().forEach(
      cache => {
        for (let idx = 0; idx < keys.length; idx++) {
          const key = keys[idx];
          if (cache.cacheKeys.includes(key)) {
            cache.clearCache();
            break;
          }
        }
      }
    );
  }

  invalidateAllCaches() {
    this.caches().forEach(
      cache => cache.clearCache()
    );
  }

}
