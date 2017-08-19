import characterReducer from '../reducer';

describe('characterReducer', () => {
  it('returns the initial state', () => {
    expect(characterReducer(undefined, {})).toEqual({});
  });
});
