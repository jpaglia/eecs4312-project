import React, { Component } from 'react';
import {  AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import AttendanceDropdown from './AttendanceDropdown';
import './AttendanceTable.scss';
class AttendanceTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "Name",
          minWidth: 200
        },
        {
          field: "Attendance",
          cellRenderer: "attendanceDropdown",
          cellRendererParams: {
            clicked: this.updateAttendance.bind(this)
          },
          minWidth: 150
        },
        {
          field: "Class",
          minWidth: 100
        },
        {
          field: "Date of Record",
          minWidth: 200
        },
        {
          field: "Verified Attendance",
          minWidth: 200
        },
        {
          field: "Parent Notified",
          minWidth: 200
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100
      },
      frameworkComponents: {
        attendanceDropdown: AttendanceDropdown
      },
      rowData: [{'Name': 'Billy', 'Attendance': "Present", 'Class': "Math", 'Date of Record': 'Tuesday', 'Verified Attendance': 'Yes', 'Parent Notified': 'No'}]
    };
  }
  
  updateAttendance(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Attendance', value)
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  render() {
  
    return (
      <div>
        <div
          id="myGrid"
          style={{
            height: "60vh",
            width: "1075px"
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            className='test'
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}

AttendanceTable.propTypes = {
 
}

export default AttendanceTable;
