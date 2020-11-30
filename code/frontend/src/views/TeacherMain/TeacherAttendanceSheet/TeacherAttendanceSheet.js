import React, { Component } from 'react';
import Proptypes from 'prop-types';
import DropdownSelect from '../../../components/DropdownSelect';
import AttendanceTable from '../../../components/AttendanceTable';
import './TeacherAttendanceSheet.scss'
import { v4 as uuidv4 } from 'uuid';
import { getAttendanceStatus } from '../../../utils/sockets';

class TeacherAttendanceSheet extends Component {

  componentDidMount() {
    const date = new Date().getTime()
    const data = {
      'date': date,
      'className': this.props.classList[0]
    }
    getAttendanceStatus(data).then(result => {
      if (!result.data.attendanceSubmitted) {
        // TODO add in getclassData endpoint
      } else {
        this.setState({ attendanceSubmitted: true })
      }
    })
  }
  
  constructor(props) {
    super(props);
    this.state = {
      className: this.props.classList[0],
      rowData: [],
      classStartHour: 0,
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
    
    const date = new Date().getTime()
    const data = {
      'date': date,
      'className': newSelection
    }
    getAttendanceStatus(data).then(result => {
      if (result.data.attendanceSubmitted) {
        this.setState({
          className: newSelection,
          attendanceSubmitted: true
        });
      }

      // Else get row data and start time
    })
  }

 

  render() {
    const dropdown = this.getDropdown();
    const attendanceTable = this.state.attendanceSubmitted ? <div>Attendance Already Submitted</div> :
    <AttendanceTable
     rowData={this.state.rowData}
     currentUser={'Teacher-Record'}
     classStartHour={this.state.classStartHour}
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
