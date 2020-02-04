const EMPTY_DATASET = {
  state: {},
  driver: {},
  messages: { messages: [] },
  car_messages: {}, // eslint-disable-line camelcase
  static: {},
  stint: {},
  session: {},
  lap: {},
  service: null
};

/** An interface over the Timing71 analysis data format. */
export default class Analysis {

  constructor() {
    this.reset();
    this.update = this.update.bind(this);
  }

  /**
   * Clear all stored analysis data.
   */
  reset() {
    this._data = EMPTY_DATASET;
  }

  /**
   * Replace the current dataset with a copy of `data`.
   * @param {Object.<string, Object>} data - The new dataset.
   * */
  setData(data) {
    this._data = {
      ...data
    };
  }

  /**
   * Merge `data` into the stored dataset under `key`.
   * @param {string} key - Analysis data key (e.g. `lap`, `static`, ...)
   * @param {Object.<string, Object>} data - The data to merge
   */
  update(key, data) {
    this._data = {
      ...this._data,
      [key]: {
        ...this._data[key],
        ...data
      }
    };
  }

};
