import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Col, Grid, Row} from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import {getCookie} from '../../utils/cookie';
import {SESSION_COOKIE_NAME} from '../../utils/constants';
import * as authActionCreator from '../../actionCreators/authActionCreator';
import * as dashboardActionCreator from '../../actionCreators/dashboardActionCreator';

export class DashboardComponent extends Component {

  componentWillMount() {
    const sid = getCookie(SESSION_COOKIE_NAME);
    if (!sid) {
      this.props.history.push('/signin');
    } else {
      this.props.getUser(sid);
    }

    if (!this.props.dashboard) {
      this.props.loadDashboard();
    }
  }

  render() {

    return (
        <Grid>
          <Row>
            <Col>
              <NavigationBar />
            </Col>
          </Row>
          <Row>
            <Col>
              <a href="https://bit.ly/IqT6zt" style={{fontSize: 40}} >Press me</a>
            </Col>
          </Row>
        </Grid>
    );
  }
}

DashboardComponent.propTypes = {
  submit: PropTypes.func.isRequired,
  getUser: PropTypes.func,
  loadDashboard: PropTypes.func,
  history: PropTypes.object,
  dashboard: PropTypes.shape({
    data: PropTypes.array,
    lk: PropTypes.bool
  })
};

DashboardComponent.defaultProps = {
  history: null,
  dashboard: null
};

const mapStateToProps = (state) => {
  return {
    pageStatus: state.auth.pageStatus,
    dashboard: state.dashboard.dashboard
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    submit: authActionCreator.submit,
    getUser: authActionCreator.getUser,
    loadDashboard: dashboardActionCreator.loadDashboard
  }, dispatch);
};

const Dashboard = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardComponent));


export default Dashboard;

