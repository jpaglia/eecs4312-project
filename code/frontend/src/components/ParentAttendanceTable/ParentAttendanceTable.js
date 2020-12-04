import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import AttendanceDiv from './AttendanceDiv';
import './ParentAttendanceTable.scss';


class ParentAttendanceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: this.getTableColumnDefs(),
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        wrapText: true,
        autoHeight: true
      },
      frameworkComponents: {
        attendanceDiv: AttendanceDiv
      },
      overlayNoRowsTemplate:
        '<div style="padding: 10px; font-style:italic;">No attendance records exist</div>',
    };
  }

  getTableColumnDefs() {
    return (
      [
        {
          field: "Name",
          minWidth: 150
        },
        {
          field: "School Name",
          minWidth: 150
        },
        {
          field: "Attendance",
          cellRenderer: "attendanceDiv",
          minWidth: 110
        },
        {
          field: "Date",
          minWidth: 130
        },
        {
          field: "Class",
          minWidth: 100
        },
        {
          field: "Start Time",
          minWidth: 120,
        },
      ]
    )
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  render() {
    return (
      <div className='attendanceTableWrapper'>
        <div
          id="myGrid"
          style={{
            height: "60vh",
            width: "780px",
            paddingLeft: "20px"
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
            onGridReady={this.onGridReady}
            rowData={this.props.rowData}
            overlayNoRowsTemplate={this.state.overlayNoRowsTemplate}
          />
        </div>
      </div>
    );
  }
}

ParentAttendanceTable.propTypes = {
  rowData: Proptypes.array.isRequired,
}

export default ParentAttendanceTable;
