import { Stints } from '../stint';

const data = {
  driver: {
    42: ['Driver One', 'Driver Two']
  },
  lap: {
    1: [
      [
        1,
        1552204495.436085,
        4,
        1552205536.464016,
        true,
        1,
        71.622,
        3,
        80.643,
        [
          [18.27,4],
          [30.622,4],
          [98.664,8]
        ]
      ]
    ],
    42: [
      [  // This is an old entry - the stint already appears in data.stint
        [
          5,
          1552206320.462731,
          36,
          1552208654.46309,
          true,
          0,
          63.214,
          10,
          71.80032258064516,
          [
            [111.175,8],
            [67.439,1],
            [65.767,1],
            [65.896,1],
            [65.483,1],
            [65.57,1],
            [65.217,1],
            [64.676,1],
            [64.89,1],
            [64.628,1],
            [64.87,1],
            [64.275,1],
            [64.349,1],
            [64.158,1],
            [64.157,1],
            [63.87,1],
            [64.173,4],
            [64.367,4],
            [63.688,4],
            [67.455,8],
            [127.282,8],
            [87.146,8],
            [64.464,1],
            [63.757,1],
            [63.214,1],
            [63.653,1],
            [63.945,4],
            [64.352,8],
            [199.358,8],
            [65.256,1],
            [64.296,1],
            [64.159,3]
          ]
        ],
        1552208655.464224
      ]
    ]
  },
  stint: {
    24: [
      [
        1,
        1552204495.436085,
        4,
        1552205536.464016,
        false,
        1,
        71.622,
        3,
        80.643,
        [
          [18.27,4],
          [30.622,4],
          [98.664,8]
        ]
      ]
    ],
    42: [
      [
        1,
        1552204495.436085,
        4,
        1552205536.464016,
        false,
        1,
        70.622,
        4,
        84.643,
        [
          [78.27,4],
          [70.622,4],
          [98.664,8],
          [992.566,10]
        ]
      ],
      [
        5,
        1552206320.462731,
        36,
        1552208655.464224,
        false,
        0,
        63.214,
        10,
        72.05503333333333,
        [
          [111.175,8],
          [67.439,1],
          [65.767,1],
          [65.896,1],
          [65.483,1],
          [65.57,1],
          [65.217,1],
          [64.676,1],
          [64.89,1],
          [64.628,1],
          [64.87,1],
          [64.275,1],
          [64.349,1],
          [64.158,1],
          [64.157,1],
          [63.87,1],
          [64.173,4],
          [64.367,4],
          [63.688,4],
          [67.455,8],
          [127.282,8],
          [87.146,8],
          [64.464,1],
          [63.757,1],
          [63.214,1],
          [63.653,1],
          [63.945,4],
          [64.352,8],
          [199.358,8],
          [65.256,1],
          [64.296,1],
          [64.159,3]
        ]
      ]
    ]
  }
};

describe('Stints', () => {
  test('collates stints correctly', () => {
    const stints = new Stints(data, 42, () => data.driver[42]);

    const all = stints.all();
    expect(all.length).toEqual(2);

    expect(all[0].driver).toEqual(data.driver[42][1]);
    expect(all[0].inProgress).toBeFalsy();
    expect(all[0].laptimes.length).toEqual(4);
    expect(all[0].averageLap).toEqual(84.643);

    expect(all[1].driver).toEqual(data.driver[42][0]);
    expect(all[1].inProgress).toBeFalsy();
    expect(all[1].laptimes.length).toEqual(32);
    expect(all[1].endLap - all[1].startLap).toEqual(31);

  });

  test('copes with no data', () => {
    const stints = new Stints(data, 14, () => data.driver[14] || []);

    expect(stints.all()).toEqual([]);
  });

  test('copes with only a current stint', () => {
    const stints = new Stints(data, 1, () => data.driver[1] || []);
    const all = stints.all();
    expect(all.length).toEqual(1);
    expect(all[0].inProgress).toBeTruthy();
  });

  test('copes with only past stint', () => {
    const stints = new Stints(data, 24, () => data.driver[24] || []);
    const all = stints.all();
    expect(all.length).toEqual(1);
    expect(all[0].inProgress).toBeFalsy();
  });
});
