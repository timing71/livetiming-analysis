const median = arr => {
  if (arr.length === 1) {
    return arr[0];
  }
  const mid = Math.floor(arr.length / 2);
  const nums = [...arr].sort((a, b) => a - b);
  if (arr.length % 2 === 0) {
    return nums[mid];
  }
  else {
    return (nums[mid - 1] + nums[mid]) / 2;
  }
};


export class Predictions {
  constructor(data, car) {
    this._data = data;
    this._car = car;
  }

  maxStintLength(yellowLapFactor = 0.5) {
    const stints = this._car.stints.all();
    const lapsPerStint = stints.map(
      s => Math.ceil((s.endLap - s.startLap + 1) - (yellowLapFactor * s.yellowLaps))
    );
    return Math.max(...lapsPerStint);
  }

  maxStintDuration() {
    const stints = this._car.stints.all();
    const timePerStint = stints.map(
      s => Math.ceil(s.endTime - s.startTime)
    );
    return Math.max(...timePerStint);
  }

  /**
   * Return a number of possible lists of stints to the end of the race.
   * @param {Object.<string, Object>} distancePrediction as returned by Session.distancePrediction
   */
  predictedStints(distancePrediction, currentTimestamp=0) {

    const result = [];

    if (!distancePrediction) {
      return result;
    }

    // Note: since the lap distance prediction is based on laps by the race
    // leader, it makes no sense to use it for predicting stints for other
    // classes in multi-class racing.

    if (distancePrediction.time && distancePrediction.time.value) {
      const finishTime = currentTimestamp + distancePrediction.time.value;
      const maxStintLength = this.maxStintLength();

      const mostRecent = this._car.stints.all().slice(-1)[0];

      const timePrediction = [];

      if (maxStintLength && mostRecent) {

        const maxStintDuration = this.maxStintDuration();

        const stopDuration = median(
          this._car.pitStops().filter(
            ps => !ps.inProgress && !!ps.stopDuration
          ).map(
            ps => ps.stopDuration
          )
        );

        let time = mostRecent.endTime;
        let lap = mostRecent.endLap;

        if (mostRecent.inProgress) {
          time = mostRecent.startTime;
          lap = mostRecent.startLap - 1;
        }

        const aveLapTime = mostRecent.laptimes.length > 0 ?
          mostRecent.laptimes.map(l => l[0]).reduce((accum, v) => accum + v) / mostRecent.laptimes.length
          : maxStintDuration / maxStintLength;

        while (time < finishTime) {
          time += stopDuration;
          const predictedStint = {
            startLap: lap + 1,
            startTime: time,
            predicted: true
          };

          time += maxStintDuration;
          lap += maxStintLength;

          predictedStint.endLap = lap;
          predictedStint.endTime = time + aveLapTime;

          predictedStint.stintDuration = predictedStint.endTime - predictedStint.startTime;
          predictedStint.stintDurationLaps = predictedStint.endLap - predictedStint.startLap + 1;

          timePrediction.push(predictedStint);
        }

        const finalStint = timePrediction.slice(-1)[0];

        if (finalStint) {

          while (
            finalStint.endTime > finishTime + aveLapTime &&
            finalStint.endLap > finalStint.startLap
          ) {
            finalStint.endTime -= aveLapTime;
            finalStint.endLap--;
          }

        }

        result.push(timePrediction);
      }
    }

    return result;
  }
}
