import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '../../../components/TextField';

//import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchBar from "material-ui-search-bar";

import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import { v4 as uuidv4 } from 'uuid';
import './SystemAdmin.scss'


class SystemAdmin extends Component {

  getTextField(defaultValue, label) {
    return <TextField
      id={`${label}_${uuidv4()}`}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
    />
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    if (e.target.id.includes('ParentName')) {
      this.setState({
        parentName: textInput
      });
    } else if (e.target.id.includes('ParentEmail')) {
      this.setState({
        parentEmail: textInput
      });
    } else if (e.target.id.includes('ParentPassword')) {
      this.setState({
        parentPassword: textInput
      });
    } else if (e.target.id.includes('TeacherName')) {
      this.setState({
        teacherName: textInput
      });
    } else if (e.target.id.includes('TeacherEmail')) {
      this.setState({
        teacherEmail: textInput
      });
    } else if (e.target.id.includes('TeacherPassword')) {
      this.setState({
        teacherPassword: textInput
      });
    }
    // } else {
    //   this.setState({
    //     teacherName: textInput
    //   });

  }


  // For Julia's Stuff
  render() {
    const parentName = this.getTextField('ParentName', 'Parent Name')
    const parentEmail = this.getTextField('ParentEmail', 'Parent Email')
    const parentPassword = this.getTextField('ParentPassword', 'Parent Password')

    const teacherName = this.getTextField('TeacherName', 'Teacher Name')
    const teacherEmail = this.getTextField('TeacherEmail', 'Teacher Email')
    const teacherPassword = this.getTextField('TeacherPassword', 'Teacher Password')

    return (
      
      <div>
        <div className="AddParent">
          <ThemeProvider theme={COLOUR_THEME}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="addParent-content"
                id="addParent-header"
              >
              <Typography className="AddParent" component={'span'}>Add a New Parent</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {parentName } 
                  {parentEmail} 
                  {parentPassword}
                  <Button onClick={this.addParent.bind(this)} color="primary" variant="contained" autoFocus>
                    Add Parent
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="removeParent-content"
                id="removeParent-header"
              >
                <Typography className="RemoveParent" component={'span'}>Remove a Parent</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  SEARCH FOR A PARENT
                  <SearchBar
                    //value={this.state.search.value}
                    value = ""
                    onChange={(filter) => this.setState({ searchParent: filter })}
                    onRequestSearch={() => this.searchForParent.bind(this)}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
            

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="addTeacher-content"
                id="addTeacher-header"
              >
              <Typography className="AddTeacher" component={'span'}>Add a New Teacher</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {teacherName} 
                  {teacherEmail} 
                  {teacherPassword}
                  <Button onClick={this.addTeacher.bind(this)} color="primary" variant="contained" autoFocus>
                    Add Full-Time Teacher
                  </Button>
                  <Button onClick={this.generateCredentials.bind(this)} color="primary" variant="contained" autoFocus>
                    Add Supply Teacher
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="removeTeacher-content"
                id="removeTeacher-header"
              >
              <Typography className="RemoveTeacher" component={'span'}>Remove a Teacher</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  SEARCH FOR A TEACHER
                  <SearchBar
                    //value={this.state.search.value}
                    value = ""
                    onChange={(filter) => this.setState({ searchTeacher: filter })}
                    onRequestSearch={() => this.searchForTeacher.bind(this)}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          
          </ThemeProvider>
        </div>


      </div>
    );
  }

  addParent() {
    // Insert Endpoint Here
    // TODO
    //this.props.parentName('SecretaryMain');
  }
  removeParent() {
  }
  addTeacher() {
  }
  removeTeacher(){
  }
  generateCredentials(){
  }
  searchForParent(){
  }
  searchForTeacher(){
  }
}

SystemAdmin.propTypes = {
  parentName: Proptypes.func,
  parentEmail: Proptypes.func,
  parentPassword: Proptypes.func,
  teacherName: Proptypes.func,
  teacherEmail: Proptypes.func,
  teacherPassword: Proptypes.func,
  searchParent: Proptypes.func,
  searchTeacher: Proptypes.func,
}

export default SystemAdmin;

