import React, { Component } from 'react';
import Proptypes from 'prop-types';
import DropdownSelect from '../../../components/DropdownSelect';
import AttendanceTable from '../../../components/AttendanceTable';
import './TeacherAttendanceSheet.scss'
import { v4 as uuidv4 } from 'uuid';
import { getAttendanceStatus, getClassData } from '../../../utils/sockets';

class TeacherAttendanceSheet extends Component {

  componentDidMount() {
    const date = new Date().getTime()
    const data = {
      'date': date,
      'className': this.props.classList[0]
    }
    getAttendanceStatus(data).then(result => {
      if (!result.data.attendanceSubmitted) {
        const data = {
          'schoolName': this.props.schoolName,
          'className':  this.props.classList[0]
        }
        getClassData(data).then(result => {
          this.setState({
            attendanceSubmitted: false,
            rowData: result.data['studentList'],
            classStartHour: parseInt(result.data['classHour'])
          })
        })
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
      if (result.data) {
        this.setState({
          className: newSelection,
          attendanceSubmitted: true
        });
      } else {
        const data = {
          'schoolName': this.props.schoolName,
          'className':  newSelection
        }
        getClassData(data).then(result => {
          this.setState({
            attendanceSubmitted: false,
            rowData: result.data['studentList'],
            classStartHour: parseInt(result.data['classHour']),
            className: newSelection,
          })
        })
      }
    })
  }

  onAttendanceSubmitted() {
    this.setState({ attendanceSubmitted: true })
  }

  render() {
    const dropdown = this.getDropdown();
    const attendanceTable = this.state.attendanceSubmitted ? <div>Attendance Already Submitted</div> :
    <AttendanceTable
     rowData={this.state.rowData}
     currentUser={'Teacher-Record'}
     classStartHour={this.state.classStartHour}
     className={this.state.className}
     schoolName={this.props.schoolName}
     onAttendanceSubmitted={this.onAttendanceSubmitted.bind(this)}
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
    classList: Proptypes.array,
    schoolName: Proptypes.string
}

export default TeacherAttendanceSheet;
