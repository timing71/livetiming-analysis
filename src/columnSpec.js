import { CachingObject, cache } from "./caching";

export default class ColumnSpec extends CachingObject {
  constructor(data) {
    super(data);

    this.get = cache(['service'], this.get.bind(this));
    this.hasStat = this.hasStat.bind(this);
    this.indexOf = this.indexOf.bind(this);
  }

  get() {
    return (this._data.service || {}).colSpec || [];
  }

  hasStat(stat) {
    return this.indexOf(stat) >= 0;
  }

  indexOf(stat) {
    const colspec = this.get();

    let statKey;
    if (Array.isArray(stat)) {
      statKey = stat[0];
    }
    else {
      statKey = stat;
    }

    return colspec.findIndex(s => s[0] === statKey);

  }
}
