import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MiniCalendar.scss';

class MiniCalendar extends Component {

  test(date) {
    if (date.getTime() === this.props.selectedDate) {
      return 'miniCalendarSelected'
    }
  }

  render() {
  
    return (
      <div className='miniCalendarWrapper'>
       <Calendar
        onChange={this.props.updateDates}
        selectRange={false}
        tileClassName={({date}) => this.test(date)}
        tileDisabled={({date, view}) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
      />

      </div>
    );
  }
}

MiniCalendar.propTypes = {
 updateDates: Proptypes.func.isRequired,
 selectedDate: Proptypes.any.isRequired
}

export default MiniCalendar;
