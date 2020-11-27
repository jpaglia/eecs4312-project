import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MiniCalendar.scss';

class MiniCalendar extends Component {


  render() {
    const dateObj = this.props.currentValue === null ? null : new Date(this.props.currentValue);
    return (
      <div className='miniCalendarWrapper'>
       <Calendar
        onChange={this.props.updateDates}
        value={dateObj}
        selectRange={false}
        tileDisabled={({date, view}) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
      />

      </div>
    );
  }
}

MiniCalendar.propTypes = {
 updateDates: Proptypes.func.isRequired,
 currentValue: Proptypes.any.isRequired
}

export default MiniCalendar;
