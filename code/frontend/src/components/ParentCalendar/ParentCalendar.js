import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import Popover from '@material-ui/core/Popover';
import { getStudentRecords } from '../../utils/sockets';
import DropdownSelect from '../../components/DropdownSelect';
import 'react-calendar/dist/Calendar.css';
import './ParentCalendar.scss';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Box from '@material-ui/core/Box';
import { v4 as uuidv4 } from 'uuid'

class ParentCalendar extends Component {

  componentDidMount() {
    const activeStartDate = new Date()
    this.viewChange(activeStartDate, 'month')
  }
  constructor() {
    super();
    this.state = {
      calendarDates: [],
      structuredDates: {},
      value: new Date(),
      calendarClass: ''
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.calendarClass !== prevState.calendarClass) {
      this.viewChange(this.state.value, 'month')
    }
  }

  // Calendar Attendance Class
  getCalendarClassDropdown(className) {
    const elements = this.props.childClasses.map((element) => {
      return element['className']
    })
    elements.unshift('All Classes')
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={elements}
      dropdownName={'Select Class'}
      currentSelection={this.state.calendarClass}
      onChange={this.handleCalendarClassDropdownChange.bind(this)}
      className={className}
    />
  }

  handleCalendarClassDropdownChange(e) {
    const newSelection = e.target.value;
    this.setState({ calendarClass: newSelection })
  }

  structureDates() {
    const dateObj = {}

    for (let i = 0; i < this.state.calendarDates.length; i++) {
      if (typeof (dateObj[`${this.state.calendarDates[i]['Date']}`]) === 'undefined') {
        dateObj[`${this.state.calendarDates[i]['Date']}`] = [];
      }
      dateObj[`${this.state.calendarDates[i]['Date']}`].push({ 'Class': this.state.calendarDates[i]['Class'], 'Attendance': this.state.calendarDates[i]['Attendance'] })
    }
    this.setState({ structuredDates: dateObj })
  }

  getclass(date, view) {
    if (view === 'month') {
      let structuredDate = ''
      if (date.getDate() < 10) {
        structuredDate = `0${date.getDate()}/`
      } else {
        structuredDate = `${date.getDate()}/`
      }
      if (date.getMonth() < 9) {
        structuredDate = structuredDate + `0${date.getMonth() + 1}/`
      } else {
        structuredDate = structuredDate + `${date.getMonth() + 1}/`
      }
      structuredDate = structuredDate + `${date.getFullYear()}`

      const dailyData = this.state.structuredDates[structuredDate];

      if (typeof (dailyData) !== 'undefined') {
        let isPresent = false;
        let isLate = false;
        let isAbsent = false;
        for (let i = 0; i < dailyData.length; i++) {
          if (dailyData[i]['Attendance'] === 'Absent') {
            isAbsent = true;
          } else if (dailyData[i]['Attendance'] === 'Late') {
            isLate = true;
          } else if (dailyData[i]['Attendance'] === 'Present') {
            isPresent = true;
          }
        }
        if (isAbsent) {
          return 'calendarAbsent'
        } else if (isLate) {
          return 'calendarLate'
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
        className: this.state.calenderClass === 'All Classes' ? '' : this.state.calendarClass,
        date: activeStartDate.getTime()
      }

      getStudentRecords(searchParams).then(result => {
      
        this.setState({
          calendarDates: result.data,
          value: activeStartDate
        }, () => this.structureDates())
      })
    }
  }

  getTileContent(date, view) {
    if (view === 'month' && (date.getDay() !== 0 && date.getDay() !== 6)) {
      let structuredDate = ''
      if (date.getDate() < 10) {
        structuredDate = `0${date.getDate()}/`
      } else {
        structuredDate = `${date.getDate()}/`
      }
      if (date.getMonth() < 9) {
        structuredDate = structuredDate + `0${date.getMonth() + 1}/`
      } else {
        structuredDate = structuredDate + `${date.getMonth() + 1}/`
      }
      structuredDate = structuredDate + `${date.getFullYear()}`
      const dailyData = this.state.structuredDates[structuredDate];

      if (typeof (dailyData) !== 'undefined') {
        const displayInfo = dailyData.map((singleClass) => {
          const value = singleClass['Attendance'].charAt(0).toUpperCase() + singleClass['Attendance'].slice(1)

          return (
            <div key={`${value}_${uuidv4()}`}>{singleClass['Class']}: {value}</div>
          )
        })

        return (
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <div className='parentCalendarPopover' {...bindTrigger(popupState)}>

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

  showRecord(date, e) {
    if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
      this.props.onSelectToday()
    }
  }

  render() {
    const classAttendanceDropdown = this.getCalendarClassDropdown('dropdownWrapper')

    return (
      <div>
        <div className='childDetailsTopBar'>
        {classAttendanceDropdown}
        </div>
        <div className='parentCalendarWrapper'>
          <Calendar
            value={this.state.value}
            className='calendarInner'
            minDetail={'year'}
            onChange={this.showRecord.bind(this)}
            showNeighboringMonth={false}
            selectRange={false}
            onActiveStartDateChange={({ activeStartDate, view }) => this.viewChange(activeStartDate, view)}
            tileClassName={({ date, view }) => this.getclass(date, view)}
            tileDisabled={({ date, view }) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
            tileContent={({ date, view }) => this.getTileContent(date, view)}
          />
        </div>
      </div>
    );
  }
}

ParentCalendar.propTypes = {
  child: Proptypes.string.isRequired,
  onSelectToday: Proptypes.func.isRequired,
  calenderClass: Proptypes.string.isRequired
}

export default ParentCalendar;
