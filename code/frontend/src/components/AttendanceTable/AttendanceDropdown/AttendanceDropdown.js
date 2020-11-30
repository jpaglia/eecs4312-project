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
      ],
      attendanceOptionsTeacher: [
        {'id': 0, 'value': ''},
        {'id': 1, 'value': 'Present'},
        {'id': 2, 'value': 'Late'}, 
        {'id': 3, 'value': 'Absent'}
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
    let value = 'Present'
    if (this.props.value === 'Late' || this.props.value === 'late') {
      colorSelect = '#e9d200'
      value = 'Late'
    } else if (this.props.value === 'Absent' || this.props.value === 'absent') {
      colorSelect = '#cf0000'
      value = 'Absent'
    }
    return (
      <select
        className='dropDownAttendance'
        value={value}
        style={{'backgroundColor': colorSelect, 'color': 'white'}}
        onChange={onAttendanceChange}>
        {options}
      </select>
    );
  }

  
  getDropdownTeacher(onAttendanceChange) {
    const colors = ['#949494', '#47bc56', '#e9d200', '#cf0000']
    const options = this.state.attendanceOptionsTeacher.map((data) => {
      return <option
        style={{'backgroundColor': colors[data.id], 'color': 'white'}}
        value={data.value} 
        key={data.value}> 
          {data.value}
        </option>
    })
    let colorSelect = '#949494';
    let value = ''
    if (this.props.value === 'Present' || this.props.value === 'present') {
      colorSelect = '#47bc56'
      value = 'Present'
    } else if (this.props.value === 'Late' || this.props.value === 'late') {
      colorSelect = '#e9d200'
      value = 'Late'
    } else if (this.props.value === 'Absent' || this.props.value === 'absent') {
      colorSelect = '#cf0000'
      value = 'Absent'
    }
    return (
      <select
        className='dropDownAttendance'
        value={value}
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
  const dropDown = this.props.type === 'Secretary' ? this.getDropdown(onAttendanceChange) : this.getDropdownTeacher(onAttendanceChange)
    return (
      <div>
        {dropDown}
      </div>
    )
  }
}

export default AttendanceDropdown;
