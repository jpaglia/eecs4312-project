import React, { Component } from 'react';
import LoginPage from './views/LoginPage';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'LoginPage',
      'userData': {},
      'userType': ''
    }

    this.onChange = this.onChange.bind(this)
    this.onLogin = this.onLogin.bind(this)
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  onLogin(newPage, data) {
    this.setState({
      'currentPage': newPage,
      'userType': data.userType
    });
  }

  render() {
    const loginPage = this.state.currentPage === 'LoginPage' ?
      <LoginPage
      /> : null;

    return (
      <div>
       {loginPage}
      </div>
    );
  }
}
export default App;
