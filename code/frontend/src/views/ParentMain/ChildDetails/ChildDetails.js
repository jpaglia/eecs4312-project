import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'
import './ChildDetails.scss';
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
        {this.props.childName}
      </div>
    );
  }
}

ChildDetails.propTypes = {
  childName: Proptypes.string.isRequired,
}

export default ChildDetails;
