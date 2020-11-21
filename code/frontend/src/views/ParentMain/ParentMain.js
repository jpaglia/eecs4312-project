import React, { Component } from 'react';

class ParentMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'SecretaryHome',
    }
  }

  render() {
  
    return (
      <div>
       Parent Page
      </div>
    );
  }
}
export default ParentMain;
