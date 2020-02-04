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
  }

  leaderLap() {
    return this._data.session.leaderLap || 0;
  }

  flagHistory() {
    return this._data.session.flagStats || [];
  }

  aggregateFlagStats() {
    return this.flagHistory().reduce(
      (accum, fp) => {
        const [flagType, startLap, startTime, endLap, endTime] = fp;

        if (flagType === 0) {
          return accum;
        }

        if (!accum[flagType]) {
          accum[flagType] = {
            count: 1,
            time: (endTime || Date.now()) - startTime,
            laps: endLap - startLap
          };
        }
        else {
          accum[flagType].count += 1;
          accum[flagType].time += (endTime || Date.now()) - startTime;
          accum[flagType].laps += (endLap - startLap);
        }

        return accum;
      },
      {}
    );


  }
};
