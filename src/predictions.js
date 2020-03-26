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
}
