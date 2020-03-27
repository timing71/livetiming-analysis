import Constants from './constants';

export class Driver {
  constructor(data, car, name, index) {
    this._data = data;
    this._car = car;
    this._index = index;

    this.name = name;
  }

  stints() {
    return this._car.stints.all().filter(
      s => s.driverIdx === this._index
    );
  }

  laptimes(onlyGreen=true, excludeInOut=true) {
    return this.stints().flatMap(
      s => {
        if (excludeInOut) {
          return s.laptimes.slice(1, -1);
        }
        return s.laptimes;
      }
    ).filter(
      l => !onlyGreen || l[1] === Constants.FlagStatus.GREEN
    ).map(l => l[0]);
  }
}
