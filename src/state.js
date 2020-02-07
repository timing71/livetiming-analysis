import { CachingObject, cache } from "./caching";

export default class State extends CachingObject {
  constructor(data) {
    super(data);
    this.get = cache(['state'], this.get.bind(this));
  }

  get() {
    return this._data.state;
  }
}
