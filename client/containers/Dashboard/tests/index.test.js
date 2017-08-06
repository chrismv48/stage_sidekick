import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import Dashboard from '../index';
import messages from '../messages';

describe('<Dashboard />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(
      <Dashboard />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
