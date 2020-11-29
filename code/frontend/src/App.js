import React, { Component } from 'react';
import LoginPage from './views/LoginPage';
import SecretaryMain from './views/SecretaryMain';
import ParentMain from './views/ParentMain';
import TeacherMain from './views/TeacherMain';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'LoginPage',
      'email': ''
    }

    this.onChange = this.onChange.bind(this)
    this.onLogin = this.onLogin.bind(this)
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  onLogin(email, newPage) {
    this.setState({
      'currentPage': newPage,
      'email': email
    });
  }

  render() {
    const loginPage = this.state.currentPage === 'LoginPage' ?
      <LoginPage
      loginVerified={this.onLogin}
      /> : null;

    const secretaryMain = this.state.currentPage === 'Secretary' ?
    <SecretaryMain
       onChange={this.onChange.bind(this)}
       email={this.state.email}
    /> : null;

    const parentMain = this.state.currentPage === 'Parent' ?
    <ParentMain
      onChange={this.onChange.bind(this)}
      email={this.state.email}
    /> : null;

    const teacherMain = this.state.currentPage === 'Teacher' ?
    <TeacherMain
      onChange={this.onChange.bind(this)}
      email={this.state.email}
    /> : null;

    return (
      <div>
       {loginPage}
       {secretaryMain}
       {parentMain}
       {teacherMain}
      </div>
    );
  }
}
export default App;
