import React, { Component } from 'react';
import Proptypes from 'prop-types';
import './ChildDetails.scss';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ParentCalendar from '../../../components/ParentCalendar'

class ChildDetails extends Component {

  componentDidMount() {
    // /getNotifications endpoint
    // TODO: update state
  }
  constructor() {
    super();
    this.state = {
      'currentPage': 'ChildDetails',
      'notifications': [{'className': 'Math', 'attendance': 'Late'}, {'className': 'Science', 'attendance': 'Absent'}]
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

  render() {
    const notifications = this.state.notifications.length > 0 ? this.getNotifications() : this.getNoWarnings();

    return (
      <div className="childDetails">
        <div className="childCalendar">
          <ParentCalendar
            child={this.props.childName}
          />
        </div>
        <div className="notificationPanel">
          <div className='notificationParentTitle'>
          Notifications
          </div>
          {notifications}
        </div>
      </div>

    );
  }
}

ChildDetails.propTypes = {
  childName: Proptypes.string.isRequired,
}

export default ChildDetails;
