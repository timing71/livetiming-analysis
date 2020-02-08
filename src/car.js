import { CachingObject, cache } from "./caching";
import { Stints } from "./stint";

export class Car extends CachingObject {
  constructor(data, raceNum) {
    super(data);
    this.raceNum = raceNum;

    this.staticData = cache(['static'], this.staticData.bind(this));
    this.drivers = cache(['driver'], this.drivers.bind(this));
    this.identifyingString = cache(
      ['driver', 'static'],
      this.identifyingString.bind(this)
    );

    this._fieldExtractor = cache(
      ['service'],
      this._fieldExtractor.bind(this)
    );

    this.stints = new Stints(this._data, this.raceNum, this.drivers);
  }

  _fieldExtractor() {
    const colSpec = this._data.service.colSpec;
    const carState = (this._data.state || {})['cars'] || [];

    return (stat, defaultValue=null) => {
      const raceNumIdx = colSpec.findIndex(s => s[0] === 'Num');
      const thisCar = carState.find(c => c[raceNumIdx] === this.raceNum);
      if (!thisCar || !stat) {
        return defaultValue;
      }

      let statKey;
      if (Array.isArray(stat)) {
        statKey = stat[0];
      }
      else {
        statKey = stat;
      }

      const statIdx = colSpec.findIndex((s) => s[0] === statKey);
      return thisCar[statIdx] || defaultValue;
    };
  }

  currentStat(stat, defaultValue=null) {
    return this._fieldExtractor()(stat, defaultValue);
  }

  staticData() {
    const raw = (this._data.static || this._data.car)[this.raceNum] || {};

    return {
      class: raw[0],
      team: raw[1],
      make: raw[2]
    };
  }

  drivers() {
    return this._data.driver[this.raceNum] || [];
  }

  identifyingString() {
    const sd = this.staticData();
    if (sd.team) {
      return `#${this.raceNum} - ${sd.team}`;
    }

    const drivers = this.drivers();
    if (drivers.length > 0) {
      return `#${this.raceNum} - ${drivers[0]}`;
    }

    if (sd.make) {
      return `#${this.raceNum} - ${sd.make}`;
    }

    return `#${this.raceNum}`;
  }

  invalidateAllCaches() {
    super.invalidateAllCaches();
    this.stints.invalidateAllCaches();
  }

  invalidateCacheFor(...keys) {
    super.invalidateCacheFor(...keys);
    this.stints.invalidateCacheFor(...keys);
  }
}

export class Cars extends CachingObject {
  constructor(data) {
    super(data);

    this.hash = cache(
      ['static'],
      this.hash.bind(this)
    );
    this.all = this.all.bind(this);
    this.get = this.get.bind(this);

    this.inClassificationOrder = cache(
      ['state', 'service', 'static'],
      this.inClassificationOrder.bind(this)
    );
  }

  hash() {
    const result = {};
    Object.keys(this._data.static || this._data.car || {}).forEach(
      carNum => {
        result[carNum] = new Car(this._data, carNum);
      }
    );
    return result;
  }

  all() {
    return Object.values(this.hash());
  }

  get(raceNum) {
    return this.hash()[raceNum];
  }

  inClassificationOrder() {
    if (this._data.service && this._data.state) {
      const raceNumIdx = this._data.service.colSpec.findIndex(s => s[0] === 'Num');

      const order = this._data.state.cars.map(c => c[raceNumIdx]);
      const cars = this.hash();

      return order.map(num => cars[num]);
    }
    return this.all();
  }

  // If invalidateAllCaches is called, then we'll recreate all Cars anyway

  invalidateCacheFor(...keys) {
    super.invalidateCacheFor(...keys);
    Object.values(this.hash()).forEach(
      car => car.invalidateCacheFor(...keys)
    );
  }
}
