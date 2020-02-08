import Session from '../session';

const MINUTES = 60 * 60;

describe('Session', () => {

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

  describe('distance prediction', () => {
    test('when race is time-certain', () => {
      const data = {
        state: {
          session: {
            timeElapsed: 45 * MINUTES,
            timeRemain: 15 * MINUTES
          }
        },
        session: {
          leaderLap: 15
        }
      };

      const session = new Session(data);

      const prediction = session.distancePrediction();

      expect(prediction.laps.predicted).toBeTruthy();
      expect(prediction.laps.value).toEqual(4);

      expect(prediction.time.predicted).toBeFalsy();
      expect(prediction.time.value).toEqual(15 * MINUTES);

    });

    test('when race is distance-certain', () => {
      const data = {
        state: {
          session: {
            timeElapsed: 45 * MINUTES,
            lapsRemain: 5
          }
        },
        session: {
          leaderLap: 16
        }
      };

      const session = new Session(data);
      const prediction = session.distancePrediction();

      expect(prediction.laps.value).toEqual(5);
      expect(prediction.laps.predicted).toBeFalsy();

      expect(prediction.time.value).toEqual(15 * MINUTES);
    });

    test('when there is insufficient data', () => {
      const data = {
        state: {
          session: {
            timeElapsed: 45 * MINUTES
          }
        },
        session: {
          leaderLap: 16
        }
      };

      const session = new Session(data);
      const prediction = session.distancePrediction();
      expect(prediction).toEqual(null);
    });

  });

});
