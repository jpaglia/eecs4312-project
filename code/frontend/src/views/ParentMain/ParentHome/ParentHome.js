import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'
import './ParentHome.scss';
class ParentHome extends Component {

  constructor() {
    super();
    this.state = {
    }
  }

  createClickableChildBox(childInfo) {
    if (childInfo.lateNotification) {
      return (
        <div className="tileShapeWarning" key={uuidv4()}>
          {childInfo.name}
        </div>
      )
    }
    return (
      <div className="tileShape" key={uuidv4()}>
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

    return (
      <div>
        {tileRow}
      </div>
    );
  }
}

ParentHome.propTypes = {
  childList: Proptypes.array.isRequired,
}

export default ParentHome;
