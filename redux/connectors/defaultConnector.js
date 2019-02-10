import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ACTION_CREATORS as UserActionCreators } from '../reducers/user';

export default function defaultConnector(WrappedComponent) {
  class ConnectedComponent extends React.Component {
    render() {
      return (
        <WrappedComponent
          componentName={WrappedComponent.name}
          {...this.props}
        />
      );
    }
  }

  function mapStateToProps(state) {
    let { user } = state;
    return {
      user
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      userActions: bindActionCreators(UserActionCreators, dispatch)
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConnectedComponent);
}
