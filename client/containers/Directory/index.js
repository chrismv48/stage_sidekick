/*
 *
 * Directory
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Layout from "../../components/Layout/index";

export class Directory extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Layout>
        Dis be the directory!
      </Layout>
    );
  }
}

Directory.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Directory);
