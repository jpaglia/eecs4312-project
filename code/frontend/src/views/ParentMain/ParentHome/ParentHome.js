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
  }

  onClick(newPage, childName) {
    this.setState({
      'currentPage': newPage,
      'selectedChild': childName
    })
  }

  createClickableChildBox(childInfo) {
    if (childInfo.Attendance === 'Absent' ) {
      return (
        <div className="tileShapeAbsent" key={uuidv4()} onClick={this.onClick.bind(this, "ChildDetails", childInfo.Name)}>
          {childInfo.Name}
          <div className='schoolNameChildTile'>{childInfo.School}</div>
        </div>
      )
    } else if(childInfo.Attendance === 'Late') {
      return (
        <div className="tileShapeLate" key={uuidv4()} onClick={this.onClick.bind(this, "ChildDetails", childInfo.Name)}>
          {childInfo.Name}
          <div className='schoolNameChildTile'>{childInfo.School}</div>
        </div>
      )
    }
    return (
      <div className="tileShapePresent" key={uuidv4()} onClick={this.onClick.bind(this, "ChildDetails", childInfo.Name)}>
        {childInfo.Name}
        <div className='schoolNameChildTile'>{childInfo.School}</div>
      </div>
    )
  }

  render() {
    const rowButtons = this.props.childList.map((childData) =>
      this.createClickableChildBox(childData));

    const pageDetails = this.state.currentPage === 'ChildDetails' ?
    <ChildDetails
      childName={this.state.selectedChild}
      onChange={this.onClick.bind(this)}
    /> :  <div className="tileRow"> {rowButtons} </div>;

    return (
      <div>
        {pageDetails}
      </div>
    );
  }
}

ParentHome.propTypes = {
  childList: Proptypes.array.isRequired,
}

export default ParentHome;
