import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { getAttendanceList } from '../../utils/sockets';
import 'react-calendar/dist/Calendar.css';
import './ParentCalendar.scss';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Box from '@material-ui/core/Box';


class ParentCalendar extends Component {

  componentDidMount() {
    const activeStartDate = new Date()
    this.viewChange(activeStartDate, 'month')
  }

  constructor() {
    super();
    this.state = {
      calendarDates: [],
      structuredDates: {}
    }
  }

  structureDates() {
    const dateObj = {}

    for (let i = 0; i < this.state.calendarDates.length; i++) {
      if (dateObj[this.state.calendarDates[i]] === null) {
        dateObj[this.state.calendarDates[i]] = [];
      }
      dateObj[this.state.calendarDates[i]].push({ 'Class': this.state.calendarDates[i]['Class'], 'Attendance': this.state.calendarDates[i]['Attendance'] })
    }
    this.setState({ structuredDates: dateObj })
  }

  getclass(date, view) {
    if (view === 'month') {
      const structuredDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      const dailyData = this.state.structuredDates[structuredDate];
      if (typeof (dailyData) !== 'undefined') {
        let isPresent = false;
        let isLate = false;
        let isAbsent = false;
        for (let i = 0; i < dailyData.length; i++) {
          if (dailyData['Attendance'] === 'absent') {
            isAbsent = true;
          } else if (dailyData[i]['Attendance'] === 'late') {
            isLate = true;
          } else if (dailyData[i]['Attendance'] === 'present') {
            isPresent = true;
          }
        }
        if (isAbsent) {
          return 'calendarPresent'
        } else if (isLate) {
          return 'calendarPresent'
        } else if (isPresent) {
          return 'calendarPresent'
        }
      }

    }
    return 'calendarStandard'
  }

  viewChange(activeStartDate, view) {

    if (view === 'month') {
      const searchParams = {
        studentName: this.props.child,
        className: '',
        startingDate: activeStartDate.getTime()
      }

      // TODO: Need to change this to get a full month of data
      // Need a diff endpoint
      // I am sending back epoch time, but you need to only use the MONTH
      // Could be any day wihtin the month...
      getAttendanceList(searchParams).then(result => {
        this.setState({
          calendarDates: result.data
        }, () => this.structureDates())
      })
    }
  }

  // UNTESTED LOGIC
  // TODO: Add endpoints and test
  getTileContent(date, view) {
    if (view === 'month' && (date.getDay() !== 0 && date.getDay() !== 6)) {
      const structuredDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      const dailyData = this.state.structuredDates[structuredDate];
      let displayInfo = <div></div>
        if (typeof (dailyData) !== 'undefined') {
          displayInfo = dailyData.map((singleClass) => {
            return(
              <div>{singleClass['Class']}</div>
            )
          })
        }
      return (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <div className='test' {...bindTrigger(popupState)}>

              </div>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box p={2}>
              <Typography>{displayInfo}</Typography>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>

      )
    }
    return (null)
  }

  render() {

    return (
      <div className='parentCalendarWrapper'>
        <Calendar
          className='calendarInner'
          minDetail={'year'}
          onChange={null}
          showNeighboringMonth={false}
          selectRange={false}
          onActiveStartDateChange={({ activeStartDate, view }) => this.viewChange(activeStartDate, view)}
          tileClassName={({ date, view }) => this.getclass(date, view)}
          tileDisabled={({ date, view }) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
          tileContent={({ date, view }) => this.getTileContent(date, view)}
        />

      </div>
    );
  }
}

ParentCalendar.propTypes = {
  child: Proptypes.string.isRequired
}

export default ParentCalendar;
