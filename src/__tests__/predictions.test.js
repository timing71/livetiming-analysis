import { Car } from '../car';
import Constants from '../constants';
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
  state: {
    cars: [
      [1, 'RUN', 1, 1.111, 1.101]
    ]
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
        1552204495.436085,
        15,
        1552205536.464016,
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
  })

  test('calculates max stint duration', () => {
    expect(car.predictions.maxStintDuration()).toEqual(1042)
  })
});
