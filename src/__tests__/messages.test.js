import Messages from '../messages';

describe(
  'Messages',
  () => {
    test(
      'collates and sorts messages correctly',
      () => {
        const data = {
          'car_messages': {
            1: [
              [12, 'the rest of the message is irrelevant'],
              [18, 'this doesn\'t match the actual format of messages']
            ],
            15: [
              [17, 'message for car 15']
            ]
          },
          messages: {
            messages: [
              [1, 'first generic message'],
              [22, 'second generic message']
            ]
          },
          state: {
            messages: [
              [25, 'new message in state'],
              [22, 'second generic message'],
              [17, 'message for car 15']
            ]
          }
        };

        const messages = new Messages(data);

        const actual = messages.get();
        expect(actual.length).toEqual(6);

        expect(actual.map(m => m[0])).toEqual([
          25, 22, 18, 17, 12, 1
        ]);
      }
    );

    test(
      'copes with missing data',
      () => {
        const data = {};
        const messages = new Messages(data);
        expect(messages.get()).toEqual([]);
      }
    )
  }
);
