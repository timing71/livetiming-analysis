import Analysis from '../analysis';

describe(
  'Analysis',
  () => {
    test(
      'update() merges data correctly',
      () => {
        const a = new Analysis();

        const originalData = a._data;
        expect(a._data.messages).toEqual({ messages: [] });

        a.update('messages', { messages: ['foo'] });

        expect(a._data.messages).toEqual({ messages: ['foo'] });
        expect(a._data).toBe(originalData);

        expect(a._data.lap).toEqual({});
        a.update('lap', { 1: ['foo'] });
        a.update('lap', { 2: ['bar'] });

        expect(a._data.lap).toEqual({
          1: ['foo'],
          2: ['bar']
        });
      }
    );
  }
);
