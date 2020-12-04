import React, { Component } from 'react';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox as CheckBoxUI} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import { v4 as uuidv4 } from 'uuid'
import './AttendanceCheckbox.scss';

class AttendanceCheckbox extends Component {

  render() {
    const onCheckChanged = () => {
      this.props.onChange(!this.props.value, this.props.rowIndex)
    }

    const cell = this.props.data['Attendance'] === 'Present' || this.props.data['Parent Notified'] === 'Y' ?
    <div></div>:
      <div className='checkBox' id={`check_box_${uuidv4()}`}>
        <ThemeProvider theme={COLOUR_THEME}>
          <FormControlLabel
            control={
              <CheckBoxUI
                onChange={onCheckChanged}
                color='primary'
                checked={this.props.value}
              />
            }
          />
        </ThemeProvider>
      </div>
    
    return (
      <div>
         {cell}
      </div>
     
    )
  }
}

export default AttendanceCheckbox;
