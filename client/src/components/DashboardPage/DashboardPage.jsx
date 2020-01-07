import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Grid, Col, Row, Table} from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import { getCookie } from '../../utils/cookie';
import { SESSION_COOKIE_NAME } from '../../utils/constants';
import * as authActionCreator from '../../actionCreators/authActionCreator';
import * as dashboardActionCreator from '../../actionCreators/dashboardActionCreator';
import Canvas from './Canvas';
import Button from "react-bootstrap/lib/Button";
import ButtonToolbar from "react-bootstrap/lib/ButtonToolbar";

export class DashboardComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      X: null,
      Y: null,
      R: null
    };

    this.handleChangeX = this.handleChangeX.bind(this);
    this.handleChangeY = this.handleChangeY.bind(this);
    this.handleChangeR = this.handleChangeR.bind(this);
    this.submit = this.submit.bind(this);
  }

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

  handleChangeX(event) {
    this.setState({X: event.target.value});
  }
  handleChangeY(event) {
    if(isNaN(event.target.value)){this.setState({Y: ''}); }
    else {
      if(event.target.value >= -3 &&  event.target.value <= 5){ this.setState({Y: event.target.value});}
      else {this.setState({Y: ''});}
    }
  }
  handleChangeR(event) {
    this.setState({R: event.target.value});
  }

  checkKey(keyOuter,keyInner){
    if(keyInner === 'updatedAt'){return null;}
    else {return this.props.dashboard.data[keyOuter][keyInner]}
  }

  submit() {
    if(this.state.X != null && this.state.Y != null && this.state.R != null)
    {this.props.submit(this.state.X, this.state.Y, this.state.R);}
    else{alert("Данные не верны.")}
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
              <Canvas > </Canvas>
            </Col>
          </Row>

          <Table striped bordered hover border="5" bordercolor="white" >
            <thead>
            <tr>
              <th>Time stamp</th>
              <th></th>
              <th>Username</th>
              <th></th>
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
            </tr>
            </thead>
            <tbody>
            {this.props.dashboard && Object.keys(this.props.dashboard.data).map(keyOuter => {
              return <tr>{Object.keys(this.props.dashboard.data[keyOuter]).map(keyInner => {
                return (        
                    <td>{this.checkKey(keyOuter,keyInner)}</td>
                  );
              })}</tr>
            })}
            </tbody>
          </Table>



          <form method="post" onSubmit={this.handleSubmit}>
            <label>
              <Row>
                <Col>X</Col>
                <ButtonToolbar>
                    <Button variant="secondary" value="-2" onClick={this.handleChangeX} >-2</Button>
                    <Button variant="success" value="-1.5" onClick={this.handleChangeX}>-1.5</Button>
                    <Button variant="warning" value="-1" onClick={this.handleChangeX}>-1</Button>
                    <Button variant="danger" value="-0.5" onClick={this.handleChangeX}>-0.5</Button>
                    <Button variant="info" value="0" onClick={this.handleChangeX}>0</Button>
                    <Button variant="dark" value="0.5" onClick={this.handleChangeX}>0.5</Button>
                    <Button variant="secondary" value="1" onClick={this.handleChangeX}>1</Button>
                    <Button variant="success" value="1.5" onClick={this.handleChangeX}>1.5</Button>
                    <Button variant="warning" value="2" onClick={this.handleChangeX}>2</Button>
                </ButtonToolbar>
              </Row>
              <Row><Col>Y</Col>
                <Col>
              <input type="text" ref="Y" name="Y" placeholder="Y" value={this.state.Y} onChange={this.handleChangeY} />
              </Col>
              </Row>
              <Row>
                <Col>R</Col>
                <Col>
                  <ButtonToolbar>
                    <Button variant="secondary" value="-2" onClick={this.handleChangeR} >-2</Button>
                    <Button variant="success" value="-1.5" onClick={this.handleChangeR}>-1.5</Button>
                    <Button variant="warning" value="-1" onClick={this.handleChangeR}>-1</Button>
                    <Button variant="danger" value="-0.5" onClick={this.handleChangeR}>-0.5</Button>
                    <Button variant="info" value="0" onClick={this.handleChangeR}>0</Button>
                    <Button variant="dark" value="0.5" onClick={this.handleChangeR}>0.5</Button>
                    <Button variant="secondary" value="1" onClick={this.handleChangeR}>1</Button>
                    <Button variant="success" value="1.5" onClick={this.handleChangeR}>1.5</Button>
                    <Button variant="warning" value="2" onClick={this.handleChangeR}>2</Button>
                </ButtonToolbar>
                </Col>
              </Row>
        </label>
            <Row>
              <Button bsStyle="primary" onClick={() => this.submit()}>Send</Button>
            </Row>
        </form>
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
    data: PropTypes.string
  })
};

DashboardComponent.defaultProps = {
  getUser: () => { },
  loadDashboard: () => { },
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
    onClick: Canvas.onClick,
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

