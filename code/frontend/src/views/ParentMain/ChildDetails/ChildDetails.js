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
      <div>
        <ParentCalendar
          child={this.props.childName}
        />
      </div>
    );
  }
}

ChildDetails.propTypes = {
  childName: Proptypes.string.isRequired,
}

export default ChildDetails;
