import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '../../../../components/TextField';
import SearchField from '../../../../components/SearchField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../../constants';
import { searchRecords, addParent } from '../../../../utils/sockets';
import './SystemAdminParentAdd.scss'

class SystemAdminParentAdd extends Component {
  constructor() {
    super();
    this.state = {
      parentName: '',
      parentEmail: '',
      parentPassword: '',
      parentChildren: [''],
      searchResult: '',
      searchQuery: '',
      errorSearch: false,
      message: '',
      errorAdd: false,
      oneValidChild: false
    }
  }

  getTextField(defaultValue, label) {
    return <TextField
      id={defaultValue}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
    />
  }

  getSearchField(defaultValue, label) {
    let i = 0;
    return this.state.parentChildren.map((value) => {
      let searchResult = i === this.state.parentChildren.length-1 ? this.state.searchResult : '';
      const errorSearch = (i === this.state.parentChildren.length-1) && this.state.errorSearch;
      i++;
      return (
      <SearchField
        id={defaultValue}
        defaultValue={defaultValue}
        value={value}
        label={label}
        key={i}
        onSearch={this.handleSearch.bind(this)}
        onSelect={this.onSelectChild.bind(this)}
        searchResult={searchResult}
        onBlur={this.handleSearchBlur.bind(this)}
        error={errorSearch}
      />)
    })
  }

  handleSearch() {
    const data = {
      'name': this.state.searchQuery,
      'schoolName': this.props.schoolName,
      'type': 'Student'
    }
    searchRecords(data).then(result => {
      if (result.data) {
          this.setState({
            searchResult: this.state.searchQuery,
            errorSearch: false
          })
      } else {
        this.setState({
          errorSearch: true
        })
      }
    })
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    this.setState({
      [e.target.id]: textInput
    });
  }

  handleSearchBlur(e) {
    const textInput = e.target.value;
    this.setState({
      'searchQuery': textInput
    });
  }

  onSelectChild() {
    const newList = [...this.state.parentChildren]
    newList[newList.length - 1] = this.state.searchResult
    newList.push('')
    this.setState({
      parentChildren: newList,
      searchResult: '',
      oneValidChild: true
    })
    console.log(this.state)
  }

  render() {
    const parentName = this.getTextField('parentName', 'Parent Name')
    const parentEmail = this.getTextField('parentEmail', 'Parent Email')
    const parentPassword = this.getTextField('parentPassword', 'Parent Password') 
    const diableButton = this.state.parentName === '' || this.state.parentEmail === '' ||
    this.state.parentPassword === '' || !this.state.oneValidChild;
    const getChild = this.getSearchField('getChild', 'Assign Child')
    const errorClassName = this.state.errorAdd ? 'error' : 'success';

    return (
      <div>
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
                <div className="accordionWrapper">
                  <div className="textBoxWrapper">
                    {parentName} 
                    {parentEmail} 
                    {parentPassword}
                  </div>
                  <div className="childBoxWrapper">
                   {getChild}
                  </div>
                  <div className="buttonWrapperParentAdd">
                    <Button
                      onClick={this.addParent.bind(this)}
                      color="primary"
                      variant="contained"
                      disabled={diableButton}
                      autoFocus>
                        Add Parent
                    </Button>
                    <div className={errorClassName}>
                      {this.state.message}
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </ThemeProvider>
      </div>
    );
  }

  addParent() {
    const childList = [...this.state.parentChildren]
    childList.pop()
    const data = {
      'Name': this.state.parentName,
      'Email': this.state.parentEmail,
      'Password':this.state.parentPassword,
      'ChildList': childList
    }
    addParent(data).then(result => {
      if (result.data.valid) {
        this.setState({
          searchResult: '',
          searchQuery: '',
          errorSearch: false,
          message: result.data.message,
          errorAdd: false,
          oneValidChild: false
        })
      } else {
        this.setState({
          message: result.data.message,
          errorAdd: true
        })
      }
    })
  }
}

export default SystemAdminParentAdd;

