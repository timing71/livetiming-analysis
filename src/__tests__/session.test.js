import Session from '../session';

const data = {
  session: {
    flagStats: [
      [1, 0, 0, 5, 1000],
      [2, 6, 1001, 8, 2000],
      [1, 9, 2001, 10, 2050]
    ],
    leaderLap: 11
  }
};

describe('Session', () => {

  test('returns flag history', () => {
    const session = new Session(data);

    const actual = session.flagHistory();

    expect(actual.length).toEqual(3);
  });

  test('aggregates flag history', () => {
    const session = new Session(data);
    const actual = session.aggregateFlagStats();

    const expected = {
      1: {
        count: 2,
        time: 1049,
        laps: 6
      },
      2: {
        count: 1,
        laps: 2,
        time: 999
      }
    };

    expect(actual).toEqual(expected);
  });

  test('returns leader lap', () => {
    const session = new Session(data);
    expect(session.leaderLap()).toEqual(11);
  });

});
