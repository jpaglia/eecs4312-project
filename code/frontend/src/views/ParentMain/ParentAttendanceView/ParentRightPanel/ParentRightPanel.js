import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { getNotifications, reportChild } from '../../../utils/sockets';

class ParentRightPanel extends Component {

  componentDidMount() {
    const data = {
      name: this.props.childName
    }
    getNotifications(data).then(result => {
      this.setState({
        notifications: result.data
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      notifications: []
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

  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}

ParentRightPanel.propTypes = {
  allChildren: Proptypes.array
}

export default ParentRightPanel;
