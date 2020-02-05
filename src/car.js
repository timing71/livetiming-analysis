import { CachingObject, cache } from "./caching";

class Car extends CachingObject {
  constructor(data, raceNum) {
    super(data);
    this.raceNum = raceNum;

    this.staticData = cache(['static'], this.staticData.bind(this));
    this.drivers = cache(['driver'], this.drivers.bind(this));
    this.identifyingString = cache(
      ['driver', 'static'],
      this.identifyingString.bind(this)
    );
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
  }

  hash() {
    return Object.fromEntries(
      Object.keys(this._data.static || this._data.car || {}).map(
        carNum => [carNum, new Car(this._data, carNum)]
      )
    );
  }

  all() {
    return Object.values(this.hash());
  }

  get(raceNum) {
    return this.hash()[raceNum];
  }
}
