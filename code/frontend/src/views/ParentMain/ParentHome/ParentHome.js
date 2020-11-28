import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'
import './ParentHome.scss';
import ChildDetails from '../ChildDetails';
class ParentHome extends Component {

  constructor() {
    super();
    this.state = {
      'currentPage': 'ParentHome',
      'selectedChild': ''
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick(newPage, childName) {
    this.setState({
      'currentPage': newPage,
      'selectedChild': childName
    })
  }

  createClickableChildBox(childInfo) {
    if (childInfo.lateNotification) {
      return (
        <div className="tileShapeWarning" key={uuidv4()} onClick={this.onClick.bind(this, "ChildDetails", childInfo.name)}>
          {childInfo.name}
        </div>
      )
    }
    return (
      <div className="tileShape" key={uuidv4()} onClick={this.onClick.bind(this, "ChildDetails", childInfo.name)}>
        {childInfo.name}
      </div>
    )
  }

  render() {
    const rowButtons = this.props.childList.map((childData) =>
      this.createClickableChildBox(childData));
    const tileRow = (
      <div className="tileRow">
        {rowButtons}
      </div>
    );

    const childDetails = this.state.currentPage === 'ChildDetails' ?
    <ChildDetails
      childName={this.state.selectedChild}
    /> : null;

    if (childDetails == null) {
      return (
        <div>
          {tileRow}
        </div>
      );
    }
    else {
      return (
        <div>
          {childDetails}
        </div>
      );
    }
    
  }
}

ParentHome.propTypes = {
  childList: Proptypes.array.isRequired,
}

export default ParentHome;
