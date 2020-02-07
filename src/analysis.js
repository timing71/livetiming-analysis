import Messages from "./messages";
import Session from "./session";
import { Cars } from "./car";
import State from "./state";

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
    this._onChange = () => {};
    this.update = this.update.bind(this);
    this.setData = this.setData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.reset();
  }

  /**
   * Set a handler function to be called when data changes. This function should
   * require no arguments.
   * @param {?function} func - Callback function. Will be called when data changes.
   */
  onChange(func) {
    this._onChange = func || (() => {});
  }

  /**
   * Clear all stored analysis data.
   */
  reset() {
    this._data = EMPTY_DATASET;

    this.cars = new Cars(this._data);
    this.messages = new Messages(this._data);
    this.session = new Session(this._data);
    this.state = new State(this._data);

    this._cachingObjects = [
      this.cars,
      this.messages,
      this.session,
      this.state
    ];

    this._onChange();
  }

  /**
   * Replace the current dataset with a copy of `data`.
   * @param {Object.<string, Object>} data - The new dataset.
   * */
  setData(data) {
    this._data = {
      ...data
    };
    this._cachingObjects.forEach(
      co => co.setData(this._data)
    );
    this._onChange();
  }

  /**
   * Merge `data` into the stored dataset under `key`.
   * @param {string} key - Analysis data key (e.g. `lap`, `static`, ...)
   * @param {Object.<string, Object>} data - The data to merge
   */
  update(key, data) {
    this._data[key] = {
      ...this._data[key],
      ...data
    };
    this._cachingObjects.forEach(
      co => co.invalidateCacheFor(key)
    );
    this._onChange();
  }
};
