import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
import { getChildren } from '../../utils/sockets';
import ParentAttendanceView from './ParentAttendanceView';

class ParentMain extends Component {

  componentDidMount() {
    const data = {
      'email': this.props.email
    }
    getChildren(data).then(result => {
      const allChildren = []
      for (let i = 0; i < result.data.length; i++) {
        allChildren.push(result.data[i]['Name'])
      }
      this.setState({
        allChildren: allChildren 
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'ParentHome',
      'allChildren': []
    }
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  render() {
    // const parentHome = this.state.currentPage === 'ParentHome' ?
    // <ParentHome
    //   childList={this.state.childList}
    // /> : null;

    const parentHome = <ParentAttendanceView
      allChildren={this.state.allChildren}
    />
  
    return (
      <div>
        <TopBar showLogout={true} onChange={this.props.onChange.bind(this)}/>
          {parentHome}
      </div>
    );
  }
}

ParentMain.propTypes = {
  onChange: Proptypes.func,
  email: Proptypes.string
}

export default ParentMain;
