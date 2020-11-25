import React, { Component } from 'react';
import './AttendanceDropdown.scss';

class AttendanceDropdown extends Component {
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
  getDropdown(onAttendanceChange) {
    const colors = ['#47bc56', '#e9d200', '#cf0000']
    const options = this.state.attendanceOptions.map((data) => {
      return <option
        style={{'backgroundColor': colors[data.id], 'color': 'white'}}
        value={data.value} 
        key={data.value}> 
          {data.value}
        </option>
    })
    let colorSelect = '#47bc56';
    if (this.props.value === 'Late') {
      colorSelect = '#e9d200'
    } else if (this.props.value === 'Absent') {
      colorSelect = '#cf0000'
    }
    return (
      <select
        className='dropDownAttendance'
        value={this.props.value}
        style={{'backgroundColor': colorSelect, 'color': 'white'}}
        onChange={onAttendanceChange}>
        {options}
      </select>
    );
  }


  render() {
    const onAttendanceChange = (event) => {
      
    const newSelection = event.target.value;
    this.props.clicked(newSelection, this.props.rowIndex);
  }
  const dropDown = this.getDropdown(onAttendanceChange)
    return (
      <div>
        {dropDown}
      </div>
    )
  }
}

export default AttendanceDropdown;
