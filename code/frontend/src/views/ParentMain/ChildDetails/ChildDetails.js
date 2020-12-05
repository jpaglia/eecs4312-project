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
import { getChildClasses, getNotifications, reportChild } from '../../../utils/sockets';

class ChildDetails extends Component {

  componentDidMount() {
    const data = {
      name: this.props.childName
    }
    getNotifications(data).then(result => {
      getChildClasses(data).then(classResult => {
        this.setState({
          childClasses: classResult.data,
          notifications: result.data
        })
      })
    })
  }
  constructor() {
    super();
    this.state = {
      'currentPage': 'ChildDetails',
      'notifications': [],
      'showReportAbsence': false,
      'reportInfo': '',
      'childClasses': [],
      'selectedClass': '',
      'lateOrAbsent': '',
      'selectedTime': 0,
      'calendarClass': ''
    }
  }

  clearNotification(className) {
    let notifications = [...this.state.notifications];
    for (let i = 0; i < this.state.notifications.length; i++) {
      if (className === this.state.notifications[i]['className']) {
        notifications.splice(i, 1)
      }
    }
    this.setState({ notifications: notifications })
  }

  getNotifications() {
    const today = new Date().toDateString();
    return this.state.notifications.map((notificationData) => {
      const severity = notificationData['attendance'] === 'Late' ? 'warning' : 'error';
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
              onClick={() => { this.clearNotification(notificationData['className']) }}
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
    this.setState({ showReportAbsence: !this.state.showReportAbsence })
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

  getClassDropdown(className) {
    const elements = this.state.childClasses.map((element) => {
      const startTime = parseInt(element['classHour']) > 12 ? `${parseInt(element['classHour']) - 12}:00 PM` : `${element['classHour']}:00 AM`
      return `${element['className']}: ${startTime}`
    })
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={elements}
      dropdownName={'Select Class'}
      currentSelection={this.state.selectedClass}
      onChange={this.handleDropdownChange.bind(this)}
      className={className}
    />
  }

  handleDropdownChange(e) {
    const newSelection = e.target.value;
    let newTime = 0
    for (let i = 0; i < this.state.childClasses.length; i++) {
      if (newSelection.split(':')[0] === this.state.childClasses[i]['className']) {
        newTime = this.state.childClasses[i]['classHour']
      }
    }
    this.setState({
      selectedClass: newSelection, 
      selectedTime: newTime
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
    const classListDropdown = this.getClassDropdown('dropdownWrapperSmall');
    const attendanceDropdown = this.getDropdownAttendance()

    return (<div className='reportAttendance'>
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
    const data = {
      'name': this.props.childName,
      'className': this.state.selectedClass,
      'date': new Date().getTime(),
      'Attendance': this.state.lateOrAbsent,
      'Reason': this.state.reportInfo
    }
    reportChild(data).then(result => {
      this.setState({
        'showReportAbsence': false
      })
    })
  }

  buttonHit() {
    this.props.onChange('ParentHome', '')
  }

  getBackButton() {
    return (
      <div className="backWrapper" onClick={this.buttonHit.bind(this)}>
        <img
          alt="Back Button"
          src="back-button.png"
          className="backButton"
        />
      </div>
    )
  }

  render() {
    const notifications = this.state.notifications.length > 0 ? this.getNotifications() : this.getNoWarnings();
    const reportAttendance = this.state.showReportAbsence ? this.getReportAttendance() : null;
    const backButton = this.getBackButton()

    return (
      <div className="childDetails">
        {backButton}
        <div className="childCalendar">
          <ParentCalendar
            child={this.props.childName}
            onSelectToday={this.updateShowReport.bind(this)}
            childClasses={this.state.childClasses}
            showReportAbsence={this.state.showReportAbsence}
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
