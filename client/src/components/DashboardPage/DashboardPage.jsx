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
import Button from "react-bootstrap/lib/Button";
import ButtonToolbar from "react-bootstrap/lib/ButtonToolbar";
import Iframe from 'react-iframe';
import VK, { Poll, Post } from "react-vk";

export class DashboardComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      X: null,
      Y: undefined,
      R: null,
      width: 500,
      height: 500
    };

    this.handleChangeX = this.handleChangeX.bind(this);
    this.handleChangeY = this.handleChangeY.bind(this);
    this.handleChangeR = this.handleChangeR.bind(this);
    this.submit = this.submit.bind(this);
    this.canvasYoutubeChanger = this.canvasYoutubeChanger.bind(this);
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

  drawCanvas(){
    const that = this;
    let width = this.state.width;
    let height = this.state.height;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

            let oldPoints = [];
            let oldPointEls = this.props.dashboard.data;
            for (let i = 0; i < oldPointEls.length; i++) {
                let x = oldPointEls[i+""]["x"];
                let y = oldPointEls[i+""]["y"];
                let hit = oldPointEls[i+""]["result"];
                oldPoints.push({x, y, hit});
            }

    let scale = this.state.R;
    let pointer = null;
    let listener = () => {};
    let mouseDownFlag = false;

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onDrag);
    canvas.addEventListener("mousedown", () => {mouseDownFlag = true});
    canvas.addEventListener("mouseup", () => {mouseDownFlag = false});
    canvas.addEventListener("mouseout", () => {mouseDownFlag = false});
    ctx.mv = function(x, y) { this.moveTo(x*width, y*height); };
    ctx.ln = function(x, y) { this.lineTo(x*width, y*height); };
    ctx.txt = function(text, x, y) { this.fillText(text, x*width, y*height); };
    rerender();

    this.setListener = setListener;
    this.setScale = setScale;
    this.setX = setX;
    this.setY = setY;

    function onClick(event) {
      if (!scale)
        return listener(null, null);
      let {layerX: elemX, layerY: elemY} = event;
      let {scrollWidth: maxX, scrollHeight: maxY} = canvas;
      let normalized = {x: elemX/maxX, y: elemY/maxY};
      pointer = normalizedToGraphCoords(normalized);
      rerender();
      that.state.X = Math.round(pointer.x*1000)/1000;
      that.state.Y = Math.round(pointer.y*1000)/1000;
      that.submit();
    }

    function onDrag(event) {
      if (!scale || !mouseDownFlag)
        return;
      let {layerX: elemX, layerY: elemY} = event;
      let {scrollWidth: maxX, scrollHeight: maxY} = canvas;
      let normalized = {x: elemX/maxX, y: elemY/maxY};
      pointer = normalizedToGraphCoords(normalized);
      rerender();
    }


    function normalizedToGraphCoords(point) {
      return {x: scale*(point.x-.5)/.4, y: -scale*(point.y-.5)/.4}
    }

    function graphToNormalizedCoords(point) {
      return {x: (point.x*0.4/scale+0.5), y: (-point.y*0.4/scale+0.5)}
    }

    function setX(x) {
      if (!pointer)
        pointer = {x: 0, y: 0};
      if (x != null)
        pointer.x = x;
      else
        pointer = null;
      rerender();
    }

    function setY(y) {
      if (!pointer)
        pointer = {x: 0, y: 0};
      if (y != null)
        pointer.y = y;
      else
        pointer = null;
      rerender();
    }

    function setScale(s) {
      if (!s)
        return;
      scale = s;
      rerender();
    }

    function setListener(l) {
      listener = l;
    }
    canvas.onload = () => {rerender()};

    function rerender(){
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#349eeb";
      ctx.fillRect(0.3*width, 0.1*height, 0.2*width, 0.4*height);
      ctx.beginPath();
      ctx.mv(.3, .5);
      ctx.ln(.5, .9);
      ctx.ln(.5, .5);
      ctx.arc(0.5*width, 0.5*height, .2*(width+height)/2, -0.5*Math.PI, 0);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";

      ctx.beginPath();
      ctx.mv(0, .5);
      ctx.ln(1, .5);
      ctx.ln(.97, .48);
      ctx.mv(1, .5);
      ctx.ln(.97, .52);

      ctx.mv(.1, .49);
      ctx.ln(.1, .51);
      ctx.mv(.3, .49);
      ctx.ln(.3, .51);
      ctx.mv(.7, .49);
      ctx.ln(.7, .51);
      ctx.mv(.9, .49);
      ctx.ln(.9, .51);

      ctx.mv(.5, 1);
      ctx.ln(.5, 0);
      ctx.ln(.48, .03);
      ctx.mv(.5, 0);
      ctx.ln(.52, .03);

      ctx.mv(.49, .9);
      ctx.ln(.51, .9);
      ctx.mv(.49, .7);
      ctx.ln(.51, .7);
      ctx.mv(.49, .3);
      ctx.ln(.51, .3);
      ctx.mv(.49, .1);
      ctx.ln(.51, .1);


      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.txt(scale ? -scale : "-R", .1, .52);
      ctx.txt(scale ? -scale/2 : "-R/2", .3, .52);
      ctx.txt(scale ? scale/2 : "R/2", .7, .52);
      ctx.txt(scale ? scale : "R", .9, .52);
      ctx.txt("x", .97, .52);

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.txt(scale ? -scale : "-R", .52, .9);
      ctx.txt(scale ? -scale/2 : "-R/2", .52, .7);
      ctx.txt(scale ? scale/2 : "R/2", .52, .3);
      ctx.txt(scale ? scale : "R", .52, .1);
      ctx.txt("y", .52, .03);
      ctx.stroke();

       if (scale) {
           for (let i = 0; i < oldPoints.length; i++) {
               let current = oldPoints[i];
               ctx.fillStyle = current.hit ? "green" : "red";
               let {x, y} = graphToNormalizedCoords(current);
               ctx.beginPath();
               ctx.arc(x*width, y*height, .005*(width+height)/2, 0, 2*Math.PI);
               ctx.fill();
           }
       }

      if (pointer) {
        ctx.fillStyle = "#aa0000";
        ctx.strokeStyle = "#aa0000";

        let {x, y} = graphToNormalizedCoords(pointer);

        ctx.beginPath();
        ctx.arc(x*width, y*height, .005*(width+height)/2, 0, 2*Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.mv(x, y + .01);
        ctx.ln(x, y + .02);
        ctx.mv(x, y - .01);
        ctx.ln(x, y - .02);
        ctx.mv(x + .01, y);
        ctx.ln(x + .02, y);
        ctx.mv(x - .01, y);
        ctx.ln(x - .02, y);
        ctx.stroke();

        if (mouseDownFlag) {
          ctx.fillStyle = "rgba(0, 0, 0, .75)";
          ctx.font = "24px Arial";
          ctx.textAlign = "left";
          ctx.textBaseline = "bottom";

          let text = `x: ${pointer.x.toFixed(2)} y: ${pointer.y.toFixed(2)}`;
          ctx.fillRect(x*width + 10, y*height - 10, 35 + 9*text.length, -50);
          ctx.fillStyle = "white";
          ctx.fillText(text, x*width + 20, y*height - 20)
        }
      }
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
    else {return ""+this.props.dashboard.data[keyOuter][keyInner]}
  }

  submit() {
    if(this.state.X != null && this.state.Y !== undefined && this.state.R != null)
    { this.props.submit(this.state.X, this.state.Y, this.state.R);
      window.location.reload();}
    else{alert("Wrong data")}
  }

  rickroll(){if(this.props.dashboard){
    if(this.props.dashboard.lk){return <a href="https://bit.ly/IqT6zt" style={{fontSize: 40}} >Press me</a> }}
  }

  canvasYoutubeChanger(){
    if (this.state.R === "-2"){ return <Iframe id="ytplayer" type="text/html" width="600" height="337"
              src="https://www.youtube.com/embed/UMRNfWSwmPo?autoplay=1&iv_load_policy=3"
              frameBorder="0" allowFullScreen> </Iframe>;
    }
    else{ if(this.state.R === "-1"){ return  <VK apiId={7280144}><Poll pollId='359747137_ab512ee8df939abeb2' /></VK>}

    else { if(this.state.R === "-1.5"){ return <VK>
      <Post ownerId={150946486}
            postId={1473}
            hash='m45L8cnzpB2HXxuXu4ThA_EqV_U' />
    </VK>}
    else{
      return <canvas ref="canvas" onLoad={this.refs.canvas && this.props.dashboard && this.drawCanvas()} width={this.state.width} height={this.state.height} onClick={this.handleCanvas}> </canvas>
    }
  }}}

  render() {

    return (
        <Grid>
          <Row>
            <Col>
              <NavigationBar />
            </Col>
          </Row>
          <Row>
            <Col sm={7}>
              {this.canvasYoutubeChanger()}
            </Col>
            <Col>
              <Grid>
              <form method="post" onSubmit={() => this.submit()}>
                <label>
                  <Row>
                    <Col>X</Col>
                    <ButtonToolbar>
                      <Button value="-2" onClick={this.handleChangeX} >-2</Button>
                      <Button value="-1.5" onClick={this.handleChangeX}>-1.5</Button>
                      <Button value="-1" onClick={this.handleChangeX}>-1</Button>
                      <Button value="-0.5" onClick={this.handleChangeX}>-0.5</Button>
                      <Button value="0" onClick={this.handleChangeX}>0</Button>
                      <Button value="0.5" onClick={this.handleChangeX}>0.5</Button>
                      <Button value="1" onClick={this.handleChangeX}>1</Button>
                      <Button value="1.5" onClick={this.handleChangeX}>1.5</Button>
                      <Button value="2" onClick={this.handleChangeX}>2</Button>
                    </ButtonToolbar>
                  </Row>
                  <Row><Col>Y</Col>
                    <Col>
                      <input type="text" ref="Y" name="Y" placeholder="Y" size={43} maxLength={7} value={this.state.Y} onChange={this.handleChangeY} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>R</Col>
                    <Col>
                      <ButtonToolbar>
                        <Button value="-2" onClick={this.handleChangeR} >-2</Button>
                        <Button value="-1.5" onClick={this.handleChangeR}>-1.5</Button>
                        <Button value="-1" onClick={this.handleChangeR}>-1</Button>
                        <Button value="-0.5" onClick={this.handleChangeR}>-0.5</Button>
                        <Button bsStyle="info" value="0" onClick={this.handleChangeR}>0</Button>
                        <Button value="0.5" onClick={this.handleChangeR}>0.5</Button>
                        <Button value="1" onClick={this.handleChangeR}>1</Button>
                        <Button value="1.5" onClick={this.handleChangeR}>1.5</Button>
                        <Button value="2" onClick={this.handleChangeR}>2</Button>
                      </ButtonToolbar>
                    </Col>
                  </Row>
                  <Row><Col>Send</Col></Row>
                <Row>
                  <Col>
                    <Button  bsStyle="success" onClick={() => this.submit()} block>Send</Button>
                    {this.rickroll()}
                  </Col>
                </Row>
              </label>
              </form>
              </Grid>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Time stamp</th>
              <th> </th>
              <th>Username</th>
              <th>Result</th>
              <th>R</th>
              <th>X</th>
              <th>Y</th>
            </tr>
            </thead>
            <tbody>
            {this.props.dashboard && Object.keys(this.props.dashboard.data).map(keyOuter => {
              return <tr key={keyOuter}>{Object.keys(this.props.dashboard.data[keyOuter]).map(keyInner => {
                return (        
                    <td key={keyInner+keyOuter}>{this.checkKey(keyOuter,keyInner)}</td>
                  );
              })}</tr>
            })}
            </tbody>
          </Table>

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

