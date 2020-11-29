import React, { Component } from 'react';
import Proptypes from 'prop-types';
import './ChildDetails.scss';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ParentCalendar from '../../../components/ParentCalendar'
import TextField from '../../../components/TextField';
import DropdownSelect from '../../../components/DropdownSelect';
import SubmitRecord from './SubmitRecord';
import { v4 as uuidv4 } from 'uuid';

class ChildDetails extends Component {

  componentDidMount() {
    // /getNotifications endpoint
    // /getChildClasses endpoint
    // TODO: update state
  }
  constructor() {
    super();
    this.state = {
      'currentPage': 'ChildDetails',
      'notifications': [{'className': 'Math', 'attendance': 'Late'}, {'className': 'Science', 'attendance': 'Absent'}],
      'showReportAbsence': false,
      'reportInfo': '',
      'childClasses': [{'className': 'Math', 'classHour': 14}],
      'selectedClass': '',
      'lateOrAbsent': 'Late',
      'selectedTime': 0
    }
  }

  clearNotification(className) {
    let notifications = [...this.state.notifications];
    for (let i = 0; i < this.state.notifications.length; i++) {
      if (className === this.state.notifications[i]['className']) {
        notifications.splice(i,1)
      }
    }
    this.setState({ notifications: notifications })
  }

  getNotifications() {
    const today = new Date().toDateString();
    return this.state.notifications.map((notificationData) => {
      const severity = notificationData['attendance'] === 'Late' ? 'warning':'error';
      const statement = notificationData['attendance'] === 'Late' ? `${this.props.childName} was late for ${notificationData['className']} on ${today}` :
      `${this.props.childName} was absent for ${notificationData['className']} on ${today}`;
      return (
      <Alert 
          key={notificationData['className']}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {this.clearNotification(notificationData['className'])}}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>}
          severity={severity}>
            {statement}
          </Alert>
      )
    })
  }

  getNoWarnings() {
    return (
      <Alert icon={false} severity="success">
        No new notifications
      </Alert>
    )
  }

  updateShowReport() {
    this.setState({ showReportAbsence: !this.state.showReportAbsence})
  }

  getTextField(defaultValue, label) {
    return <TextField
      id={`${label}_${uuidv4()}`}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
      multiline={true}
      className={'textArea'}
    />
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    this.setState({
      reportInfo: textInput
    });
  }

  getDropdown() {
    const elements = this.state.childClasses.map((element) => {
      return element['className']
    })
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={elements}
      dropdownName={'Select Class'}
      currentSelection={this.state.selectedClass}
      onChange={this.handleDropdownChange.bind(this)}
      className='dropdownWrapperSmall'
    />
  }

  handleDropdownChange(e) {
    const newSelection = e.target.value;
    let newTime = 0
    for (let i = 0; i < this.state.childClasses.length; i++) {
      if (newSelection === this.state.childClasses[i]['className']) {
        newTime = this.state.childClasses[i]['classHour']
      }
    }
    this.setState({
      selectedClass: newSelection, selectedTime: newTime
    });
  }

  getDropdownAttendance() {
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={['Absent', 'Late']}
      dropdownName={'Attendance'}
      currentSelection={this.state.lateOrAbsent}
      onChange={this.handleDropdownAttendanceChange.bind(this)}
      className='dropdownWrapperSmall'
    />
  }

  handleDropdownAttendanceChange(e) {
    const newSelection = e.target.value;
   
    this.setState({
      lateOrAbsent: newSelection
    });
  }

  checkSubmitDisabled() {
    return this.state.reportInfo === '' || this.state.lateOrAbsent === '' || this.state.selectedClass === ''
  }

  // For reporting Absence/Late
  getReportAttendance() {
    const reasoning = this.getTextField('Reasoning...', 'Reason for Being Absent/Late')
    const classListDropdown = this.getDropdown();
    const attendanceDropdown = this.getDropdownAttendance()

    return(<div className='reportAttendance'>
      <div className='reportAttendanceTile'>Report Attendance</div>
      <div className='reportAttendanceBottom'>
          {classListDropdown}
          {attendanceDropdown}
      </div>
      <div>
        {reasoning}
      </div>
        <SubmitRecord
          disableButton={this.checkSubmitDisabled()}
          submitRecordFunc={this.sendRecord.bind(this)}
          classStartHour={this.state.selectedTime}
        />
    </div>)
  }

  sendRecord() {
    // Add endpoint
  }

  render() {
    const notifications = this.state.notifications.length > 0 ? this.getNotifications() : this.getNoWarnings();
    const reportAttendance = this.state.showReportAbsence ? this.getReportAttendance() : null;

    return (
      <div className="childDetails">
        <div className="childCalendar">
          <ParentCalendar
            child={this.props.childName}
            onSelectToday={this.updateShowReport.bind(this)}
          />
        </div>
        <div className='rightSidepanelParent'>
        <div className="notificationPanel">
          <div className='notificationParentTitle'>
          Notifications
          </div>
          {notifications}
        </div>
        {reportAttendance}
        </div>
      </div>

    );
  }
}

ChildDetails.propTypes = {
  childName: Proptypes.string.isRequired,
}

export default ChildDetails;
