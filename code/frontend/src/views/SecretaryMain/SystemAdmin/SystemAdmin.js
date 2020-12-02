import React, { Component } from 'react';
import SystemAdminParentAdd from './SystemAdminParentAdd';
import SystemAdminRemoveParent from './SystemAdminRemoveParent';
import SystemAdminAddTeacher from './SystemAdminAddTeacher'
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import Proptypes from 'prop-types';
import './SystemAdmin.scss'

class SystemAdmin extends Component {
  render() {
    return (
      <div>
        <div className="AddParent">
          <ThemeProvider theme={COLOUR_THEME}>
            <SystemAdminParentAdd
               schoolName={this.props.schoolName}
            />
            <SystemAdminRemoveParent
              removeParentBool={true}
              schoolName={this.props.schoolName}
            />
            <SystemAdminAddTeacher
              schoolName={this.props.schoolName}
            />
            <SystemAdminRemoveParent
              removeParentBool={false}
            />
          </ThemeProvider>
        </div>


      </div>
    );
  }
}

SystemAdmin.propTypes = {
  schoolName: Proptypes.string,
}

export default SystemAdmin;

