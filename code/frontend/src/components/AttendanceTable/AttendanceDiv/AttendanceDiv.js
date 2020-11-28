import React, { Component } from 'react';
import './AttendanceDiv.scss';

class AttendanceDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceOptions: [
        {'id': 0, 'value': 'Present'},
        {'id': 1, 'value': 'Late'}, 
        {'id': 2, 'value': 'Absent'}
      ]
    }
  }
  


  render() {
    let colorSelect = '#47bc56';
    if (this.props.value === 'late') {
      colorSelect = '#e9d200'
    } else if (this.props.value === 'absent') {
      colorSelect = '#cf0000'
    }
    const value = this.props.value.charAt(0).toUpperCase() + this.props.value.slice(1)
    return (
      <div className='attendanceDiv' style={{'backgroundColor': colorSelect, 'color': 'white'}}>
        {value}
      </div>
    )
  }
}

export default AttendanceDiv;
