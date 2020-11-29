import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { getStudentRecords } from '../../utils/sockets';
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
      if (typeof(dateObj[`${this.state.calendarDates[i]['Date']}`]) === 'undefined') {
        dateObj[`${this.state.calendarDates[i]['Date']}`] = [];
      }
      dateObj[`${this.state.calendarDates[i]['Date']}`].push({ 'Class': this.state.calendarDates[i]['Class'], 'Attendance': this.state.calendarDates[i]['Attendance'] })
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
        Name: this.props.child,
        className: '',
        date: activeStartDate.getTime()
      }

      getStudentRecords(searchParams).then(result => {
        
        this.setState({
          calendarDates: result.data
        }, () => this.structureDates())
      })
    }
  }

  getTileContent(date, view) {
    if (view === 'month' && (date.getDay() !== 0 && date.getDay() !== 6)) {
      const structuredDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      const dailyData = this.state.structuredDates[structuredDate];
      if (typeof (dailyData) !== 'undefined') {
        const displayInfo = dailyData.map((singleClass) => {
          const value = singleClass['Attendance'].charAt(0).toUpperCase() + singleClass['Attendance'].slice(1)

          return(
          <div>{singleClass['Class']}: {value}</div>
          )
        })
        
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
                {displayInfo}
                  </Box>
                </Popover>
              </div>
            )}
          </PopupState>
  
        )
      }
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
