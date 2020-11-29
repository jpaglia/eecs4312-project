import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopBar from '../../components/TopBar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TeacherHistoricalRecords from './TeacherHistoricalRecords'
import TeacherAttendanceSheet from './TeacherAttendanceSheet'
import { getAttendanceList } from '../../utils/sockets';
// import './TeacherMain.scss'
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
class TeacherMain extends Component {

  componentDidMount() {
    this.getInitialData()
   
  }
  constructor(props) {
    super(props);
    this.state = {
      'value': 0,
      'schoolName': 'Maplewood High School',   // get this based on login, or hardcode for demo idk
      'initialHistoricalData': [],
      'teacherEmail': props.email,
      'classList': [] // Update with endpoint on mount
    }
  }

  onChange(event, newValue) {
    this.setState({
      'value': newValue 
    })
  }

  getInitialData() {
    // Get Search value
    const searchParams = {
      studentName: '',
      className: '',
      startingDate: null
    }
    // TODO
    // Call endpoint for available ClassList
    // Add to state
     

    getAttendanceList(searchParams).then(result => {
      this.setState({
        initialHistoricalData : result.data,
      })
    })
  }

  getMainPage() {
    return (
      <div className='secretaryWrapperPage'>
      <div className='welcomePageTitleTextBox'>
        <div className='titleText'>
          Welcome to
        </div>
        <div className='schoolNameText'>
          {this.state.schoolName}
        </div>
      </div>
      </div>
    )
  }
  
  render() {
    const teacherMainPage = this.getMainPage();
   
    return (
      <div>
        <TopBar
            showLogout={true}
            onChange={this.props.onChange.bind(this)}
          />
        <div>
          <AppBar className="appBarStyle" position="static">
            <Tabs value={this.state.value} onChange={this.onChange.bind(this)} aria-label="simple tabs example">
              <Tab label="Main Screen" {...a11yProps(0)} />
              <Tab label="Past Attendance Records" {...a11yProps(1)} />
              <Tab label="Create Attendance Record" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.value} index={0}>
            {teacherMainPage}
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            <TeacherHistoricalRecords
              initialRowData={this.state.initialHistoricalData}
            />
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            <TeacherAttendanceSheet
            classList={this.state.classList}
            />
          </TabPanel>
        </div>
      </div>
    );
  }
}

TeacherMain.propTypes = {
  onChange: PropTypes.func,
  email: PropTypes.string
}

export default TeacherMain;
