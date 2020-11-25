import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


class AttendanceTable extends Component {


  getColumnDefs() {
    return (
      [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' }
      ]
    );
  } 
  
  getRowData() {
    return (
      [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
      ]
    )
  }
 
  
  render() {
  
    return (
      <div className='miniCalendarWrapper'>

      </div>
    );
  }
}

AttendanceTable.propTypes = {
 
}

export default AttendanceTable;
