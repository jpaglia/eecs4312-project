import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';

class TeacherMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'TeacherHome',
    }
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  render() {
  
    return (
      <div>
        <TopBar showLogout={true} onChange={this.props.onChange.bind(this)}/>
       Teacher Page
      </div>
    );
  }
}

TeacherMain.propTypes = {
  onChange: Proptypes.func,
}

export default TeacherMain;
