import { CachingObject, cache } from "./caching";

export default class Session extends CachingObject {
  constructor(data) {
    super(data);
    this.aggregateFlagStats = cache(
      ['session', 'state'],
      this.aggregateFlagStats.bind(this)
    );
    this.flagHistory = cache(
      ['session', 'state'],
      this.flagHistory.bind(this)
    );

    this.leaderLap = cache('session', this.leaderLap.bind(this));
    this.currentTimestamp = cache('session', this.currentTimestamp.bind(this));
  }

  leaderLap() {
    return this._data.session.leaderLap || 0;
  }

  flagHistory() {
    return this._data.session.flagStats || [];
  }

  currentTimestamp() {
    return (this._data.session || {})['currentTimestamp'] || Date.now();
  }

  aggregateFlagStats() {
    return this.flagHistory().reduce(
      (accum, fp) => {
        const [flagType, startLap, startTime, endLap, endTime] = fp;

        if (flagType === 0) {
          return accum;
        }

        const thisPeriodEnd = endTime || this.currentTimestamp() || Date.now();
        const thisPeriodEndLap = endLap || this.leaderLap();

        if (!accum[flagType]) {
          accum[flagType] = {
            count: 1,
            time: thisPeriodEnd - startTime,
            laps: thisPeriodEndLap - startLap
          };
        }
        else {
          accum[flagType].count += 1;
          accum[flagType].time += (thisPeriodEnd - startTime);
          accum[flagType].laps += (thisPeriodEndLap - startLap);
        }

        return accum;
      },
      {}
    );


  }
};
