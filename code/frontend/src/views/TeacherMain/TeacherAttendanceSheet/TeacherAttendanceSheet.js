import React, { Component } from 'react';
import Proptypes from 'prop-types';
import DropdownSelect from '../../../components/DropdownSelect';
import Button from '@material-ui/core/Button';
import AttendanceTable from '../../../components/AttendanceTable';
import './TeacherAttendanceSheet.scss'
import { v4 as uuidv4 } from 'uuid'

// Working on calendar next
// Need to add in dates
class TeacherAttendanceSheet extends Component {

  componentDidMount() {
    //TODO: add /getAttendanceStatus
    // this.setState({
    //   attendanceSubmitted: result.data.attendanceSent
    // })
  }
  
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      rowData: [],
      classStartHour: 0,
      classStartMin: 0,
      attendanceSubmitted: false
    }
  }

  getDropdown() {
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={this.props.classList}
      dropdownName={'Select Class'}
      currentSelection={this.state.className}
      onChange={this.handleDropdownChange.bind(this)}
    />
  }

  handleDropdownChange(e) {
    const newSelection = e.target.value;
    // Get class Data (students and start time)
    this.setState({
      className: newSelection
    });
  }

 

  render() {
    const dropdown = this.getDropdown();
    const attendanceTable = this.state.attendanceSubmitted ? <div>Attendance Already Submitted</div> :
    <AttendanceTable
     rowData={this.state.rowData}
     currentUser={'Teacher-Record'}
     classStartHour={this.state.classStartHour}
     classStartMin={this.state.classStartMin}
    />

    return (
      <div>
        {dropdown}
        <div className='tableAttendance'>
         {attendanceTable}
        </div>
      </div>
    );
  }
}

TeacherAttendanceSheet.propTypes = {
    classList: Proptypes.array
}

export default TeacherAttendanceSheet;
