import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopBar from '../../components/TopBar';
import SystemAdmin from './SystemAdmin';
import SecretaryAttendance from './SecretaryAttendance';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import './SecretaryMain.scss'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


class SecretaryMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'schoolName': '',
      'value': 0
    }
  }

  onChange(event, newValue) {
    this.setState({
      'value': newValue 
    })
  }

  getMainPage() {
    return (
      <div>
        Secretary Page
      </div>
    )
  }
  

  render() {
    const secretaryMainPage = this.getMainPage();
    const systemAdminPage = <SystemAdmin />;
    const secretaryAttendancePage = <SecretaryAttendance />;

    // TODO: Add in some welcome text or smthg 

    return (
      <div>
        <TopBar
          showLogout={true}
          onChange={this.props.onChange.bind(this)}
          showBack={true}
          onBack={this.onChange.bind(this)}
        />
        <div className="secretaryWrapperPage">
          <div>
            <AppBar className="appBarStyle" position="static">
              <Tabs value={this.state.value} onChange={this.onChange.bind(this)} aria-label="simple tabs example">
                <Tab label="Main Screen" {...a11yProps(0)} />
                <Tab label="Administration Panel" {...a11yProps(1)} />
                <Tab label="Attendance Records" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.value} index={0}>
              {secretaryMainPage}
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
               {systemAdminPage}
             </TabPanel>
            <TabPanel value={this.state.value} index={2}>
              {secretaryAttendancePage}
            </TabPanel>
          </div>
        </div>
      </div>
    );
  }
}

SecretaryMain.propTypes = {
  onChange: PropTypes.func,
}

export default SecretaryMain;
