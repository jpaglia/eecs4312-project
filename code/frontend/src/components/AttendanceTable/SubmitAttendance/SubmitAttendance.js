import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import Button from '@material-ui/core/Button';
import './SubmitAttendance.scss';

class SubmitAttendance extends Component {
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    // 30 = minutes need to pass to post
   const bufferTime = 30 * 60 * 1000;
   const submitTime = this.state.classStart.getTime() + bufferTime;
   const currentTime = new Date().getTime()
   if (currentTime >= submitTime && this.state.disableTime) {
    this.setState({ disableTime: false });
   }
  }

  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      classStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.props.classStartHour, this.props.classStartMin),
      disableTime: true
    }
  }
  

  // TODO: Add button hover
  render() {
   
    return (
      <div className='submitAttendance'>
      <ThemeProvider theme={COLOUR_THEME}>
        <Button
          className="submitAttendanceButton"
          onClick={this.props.submitAttendance.bind(this)}
          color="primary"
          variant="contained"
          disabled={this.state.disableTime || this.props.disableButton}
          autoFocus>
            Submit Attendance
      </Button>
      </ThemeProvider>
    </div>
    )
  }
}

SubmitAttendance.propTypes = {
  submitAttendance: Proptypes.func,
  classStartHour: Proptypes.number,
  classStartMin: Proptypes.number,
  disableButton: Proptypes.bool
}

export default SubmitAttendance;
