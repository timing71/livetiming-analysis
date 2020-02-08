import { CachingObject, cache } from "./caching";

const makeStintObject = (drivers) => (stint) =>({
  startLap: stint[0],
  startTime: stint[1],
  endLap: stint[2],
  endTime: stint[3],
  inProgress: stint[4],
  driverIdx: stint[5],
  driver: drivers[stint[5]],
  bestLap: stint[6],
  yellowLaps: stint[7],
  averageLap: stint[8],
  laptimes: stint[9],
  stintDuration: stint[3] ? stint[3] - stint[1] : undefined,
  stintDurationLaps: stint[2] ? stint[2] - stint[0] + 1 : undefined
});

export class Stints extends CachingObject {
  constructor(data, raceNum, drivers) {
    super(data);
    this.raceNum = raceNum;
    this.drivers = drivers;

    this.all = cache(['driver', 'stint', 'lap'], this.all.bind(this));
  }

  all() {
    const completed = (this._data.stint[this.raceNum] || []);
    const current = (this._data.lap[this.raceNum] || [])[0];

    const shouldAppendCurrent = current && (
      completed.length === 0 || current[0] > completed[completed.length - 1][0]
    );

    if (shouldAppendCurrent) {
      return [...completed, current].map(makeStintObject(this.drivers()));
    }
    return completed.map(makeStintObject(this.drivers()));
  }
}
