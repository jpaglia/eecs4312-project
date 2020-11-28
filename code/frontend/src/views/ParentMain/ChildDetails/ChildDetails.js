import React, { Component } from 'react';
import Proptypes from 'prop-types';
import './ChildDetails.scss';
import ParentCalendar from '../../../components/ParentCalendar'

class ChildDetails extends Component {
  constructor() {
    super();
    this.state = {
      'currentPage': 'ChildDetails'
    }
  }

  render() {
     return (
      <div className="childDetails">
        <div className="childCalendar">
          <ParentCalendar
            child={this.props.childName}
          />
        </div>
        <div className="notificationPanel">
          Notifications
        </div>
      </div>
      
    );
  }
}

ChildDetails.propTypes = {
  childName: Proptypes.string.isRequired,
}

export default ChildDetails;
