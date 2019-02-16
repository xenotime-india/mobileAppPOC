import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ACTION_CREATORS as UserActionCreators } from '../reducers/user';
import { ACTION_CREATORS as EventActionCreators } from '../reducers/event';

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
    let { user, event } = state;
    return {
      user,
      event
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      userActions: bindActionCreators(UserActionCreators, dispatch),
      eventActions: bindActionCreators(EventActionCreators, dispatch)
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConnectedComponent);
}
