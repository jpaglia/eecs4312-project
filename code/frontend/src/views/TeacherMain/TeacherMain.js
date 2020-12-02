import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopBar from '../../components/TopBar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TeacherHistoricalRecords from './TeacherHistoricalRecords'
import TeacherAttendanceSheet from './TeacherAttendanceSheet'
import { getSchoolName, getTeacherClasses } from '../../utils/sockets';
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
    const data = {
      'email': this.props.email
    }
    getSchoolName(data).then(result => {
      const schoolName = result.data['schoolName']
      getTeacherClasses(data).then(result => {
        const classes = [];
        for (let i = 0; i < result.data.length; i++) {
          classes.push(result.data[i]['className'])
        }
        this.setState({ schoolName: schoolName, classList: classes })
      })
    })
    
    
   
  }
  constructor(props) {
    super(props);
    this.state = {
      'value': 0,
      'schoolName': '',   // get this based on login, or hardcode for demo idk
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

  getMainPage() {
    const mainDiv = this.state.schoolName !== '' ?(
      <div className='welcomePageTitleTextBox'>
        <div className='titleText'>
          Welcome to
        </div>
        <div className='schoolNameText'>
          {this.state.schoolName}
        </div>
      </div>
    ): null

    return (
      <div className='secretaryWrapperPage'>
        {mainDiv}
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
              classList={this.state.classList}
              email={this.props.email}
              schoolName={this.state.schoolName}
            />
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            <TeacherAttendanceSheet
              classList={this.state.classList}
              schoolName={this.state.schoolName}
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
