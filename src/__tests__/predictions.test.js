import { Car } from '../car';
import Constants from '../constants';
import Session from '../session';
const { Stat } = Constants;

const data = {
  service: {
    colSpec: [
      Stat.NUM,
      Stat.STATE,
      Stat.LAPS,
      Stat.LAST_LAP,
      Stat.BEST_LAP
    ]
  },
  static: {
    1: ['CAR1CLASS', 'Car1team', 'Car1type']
  },
  driver: {
    1: ['driver1a', 'driver1b']
  },
  session: {
    currentTimestamp: 1552205750,
    leaderLap: 16
  },
  state: {
    cars: [
      [1, 'RUN', 1, 1.111, 1.101]
    ],
    session: {
      timeElapsed: 15 * 60,
      timeRemain: 21 * 60
    }
  },
  stint: {
    1: [
      [
        1,
        1552204495.436085,
        10,
        1552205536.464016,
        false,
        1,
        71.622,
        0,
        80.643,
        [
          [1,4],
          [2,4],
          [3,8],
          [4,4],
          [5,4],
          [6,4],
          [7,4],
          [8,4],
          [9,4],
          [10,4],
        ]
      ],
      [
        11,
        1552205646.436085,
        15,
        1552205736.464016,
        false,
        1,
        71.622,
        0,
        80.643,
        [
          [11,4],
          [12,4],
          [13,4],
          [14,4],
          [15,4],
        ]
      ]
    ]
  },
  lap: {}
};

describe('Predictions', () => {
  const car = new Car(data, '1');

  test('calculates max stint length', () => {
    expect(car.predictions.maxStintLength()).toEqual(10)
  });

  test('calculates max stint duration', () => {
    expect(car.predictions.maxStintDuration()).toEqual(1042)
  });

  test('predicts remaining stints', () => {
    const distancePrediction = new Session(data).distancePrediction(
      10,
      data.session.currentTimestamp
    );

    const predictedStints = car.predictions.predictedStints(distancePrediction, data.session.currentTimestamp);

    expect(predictedStints.length).toEqual(1);
    const prediction = predictedStints[0];
    expect(prediction.length).toEqual(2);

    const s = prediction[0];
    expect(s.predicted).toEqual(true);
    expect(s.startLap).toEqual(16);
    expect(s.startTime).toBeCloseTo(1552205736 + 110, 0); // end of prev stint + median pit stop time

    const s2 = prediction[1];
    expect(s2.startLap).toEqual(s.endLap + 1);
    expect(s2.endTime).toBeGreaterThan(data.session.currentTimestamp + distancePrediction.time.value);
  });
});
