import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../../constants';
import Button from '@material-ui/core/Button';
import './SubmitRecord.scss';

class SubmitRecord extends Component {
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
   const submitTime = this.state.classStart.getTime();
   const currentTime = new Date().getTime()
   if (currentTime > submitTime && !this.state.disableTime) {
    this.setState({ disableTime: true });
   }
  }

  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      classStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.props.classStartHour, 0),
      disableTime: false
    }
  }
  

  // TODO: Add button hover
  render() {
   
    return (
      <div className='attendanceRecordParentSubmit'>
      <ThemeProvider theme={COLOUR_THEME}>
        <Button
          onClick={this.props.submitRecordFunc.bind(this)}
          color="primary"
          variant="contained"
          disabled={this.state.disableTime || this.props.disableButton}
          autoFocus>
            Submit Record
      </Button>
      </ThemeProvider>
    </div>
    )
  }
}

SubmitRecord.propTypes = {
  submitRecordFunc: Proptypes.func,
  classStartHour: Proptypes.number,
  disableButton: Proptypes.bool
}

export default SubmitRecord;
