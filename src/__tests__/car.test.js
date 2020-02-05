import { Car, Cars } from '../car';
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
    1: ['CAR1CLASS', 'Car1team', 'Car1type'],
    9: ['CAR9CLASS', '', 'Car9type']
  },
  driver: {
    1: ['driver1a', 'driver1b'],
    9: ['driver9a']
  },
  state: {
    cars: [
      [1, 'RUN', 1, 1.111, 1.101],
      [9, 'PIT', 9, 9.999, 9.888]
    ]
  }
};

describe('Cars', () => {
  test('lists all known cars', () => {
    const cars = new Cars(data);

    const actual = cars.all();
    expect(actual.length).toEqual(2);
  });

  test('finds a specific car', () => {
    const cars = new Cars(data);
    const actual = cars.get(9);

    expect(actual.staticData().make).toEqual('Car9type');
  });

  test('does not find a non-existent car', () => {
    const cars = new Cars(data);
    const actual = cars.get(42);
    expect(actual).toEqual(undefined);
  });
});

describe('Car', () => {
  test('field extractors', () => {
    const car = new Car(data, 1);

    const laps = car.currentStat(Stat.LAPS);
    expect(laps).toEqual(1);
    expect(car.currentStat(Stat.BEST_LAP)).toEqual(1.101);

    // default if the stat isn't available
    expect(car.currentStat(Stat.NO_TOW_RANK, 444)).toEqual(444);

    // it's OK if the array identity is different
    expect(car.currentStat([...Stat.BEST_LAP])).toEqual(1.101);
    // and if we just use a string
    expect(car.currentStat('Best')).toEqual(1.101);
  });

  describe('identifyingString', () => {
    test('when a team name is supplied', () => {
      data['static'][4] = ['Clazz', 'TeamName', 'CarType'];
      const car = new Car(data, 4);
      expect(car.identifyingString()).toEqual('#4 - TeamName');
    });

    test('when no team name is supplied', () => {
      data['static'][5] = ['Clazz', '', 'CarType'];
      data['driver'][5] = ['DriverOne', 'DriverTwo'];
      const car = new Car(data, 5);
      expect(car.identifyingString()).toEqual('#5 - DriverOne');
    });

    test('with neither team name nor drivers', () => {
      data['static'][6] = ['Clazz', '', 'CarType'];
      const car = new Car(data, 6);
      expect(car.identifyingString()).toEqual('#6 - CarType');
    })
  });
});
