const sortByIndex = (index) => (a, b) => b[index] - a[index];

export default class Messages {
  constructor(data) {
    this._data = data;
    this.get = this.get.bind(this);
  }

  get() {
    const carMessages = Object.values(
      this._data['car_messages'] || {}
    ).reduce(
      (acc, val) => acc.concat(val),
      [])
    ; // Array.prototype.flat not available in Node 10
    const analysisMessages = (this._data.messages || {})['messages'] || [];

    const persistedMessages = [...carMessages, ...analysisMessages].sort(sortByIndex(0));

    const stateMessages = ((this._data.state || {})['messages'] || []).sort(sortByIndex(0));

    const additionalMessages = stateMessages.filter(
      m => persistedMessages.length === 0 || m[0] > persistedMessages[0][0]
    );

    return [...additionalMessages, ...persistedMessages];
  }
};
