import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import { getAttendanceList } from '../../utils/sockets';
import 'react-calendar/dist/Calendar.css';
import './ParentCalendar.scss';

class ParentCalendar extends Component {

  componentDidMount() {
    const activeStartDate = new Date()
    this.viewChange(activeStartDate, 'month')
  }

  constructor() {
    super();
    this.state = {
      calendarDates: []
    }
  }

  getclass(date, view) {
    if (view === 'month') {
      const structuredDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      let isPresent = false;
      let isLate = false;
      let isAbsent = false;
      for(let i =0; i < this.state.calendarDates.length; i++) {
        if (this.state.calendarDates[i]['Date'] === structuredDate) {
          if (this.state.calendarDates[i]['Attendance'] === 'absent') {
            isAbsent = true;
          }else if (this.state.calendarDates[i]['Attendance'] === 'late') {
            isLate = true;
          } else if (this.state.calendarDates[i]['Attendance'] === 'present') {
            isPresent = true;
          }
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
    return 'calendarStandard'
  }

  viewChange(activeStartDate, view) {
    
    if(view === 'month') {
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
       })
      })
    }
  }

  render() {
  
    return (
      <div className='parentCalendarWrapper'>
       <Calendar
        className='calendarInner'
        onChange={null}
        showNeighboringMonth={false}
        selectRange={false}
        onActiveStartDateChange={({activeStartDate, view}) => this.viewChange(activeStartDate, view)}
        tileClassName={({date, view}) => this.getclass(date, view)}
        tileDisabled={({date, view}) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
      />

      </div>
    );
  }
}

ParentCalendar.propTypes = {
 child : Proptypes.string.isRequired
}

export default ParentCalendar;
