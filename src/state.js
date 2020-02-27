import { CachingObject, cache } from "./caching";

export default class State extends CachingObject {
  constructor(data) {
    super(data);
    this.get = cache(['state'], this.get.bind(this));
    this.currentFlag = cache(['state'], this.currentFlag.bind(this));
  }

  get() {
    return this._data.state || {};
  }

  currentFlag() {
    if (this._data.state.session) {
      return this._data.state.session.flagState || 'none';
    }
    return 'none';
  }
}
