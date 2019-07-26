import React from 'react';
import styled from 'styled-components';
import {Actions, Manager} from '@twilio/flex-ui';


const Background = styled.div`
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 8; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
`;

const PopUp = styled.div`
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 60%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  & label{
    display: block;
    margin: 10px 0 5px;
    font-size: 14px;
    font-weight: 500;
  }
  & textarea{
    width: 100%;
    height: 100px;
  }
`;

const PopupHeader = styled.div`
  padding: 5px 60px;
  background-color: #5cb85c;
  color: white;
`;

const PopupBody = styled.div`
    padding: 15px 60px;
`;

const PopupFooter = styled.div`
    padding: 5px 60px;
    background-color: #5cb85c;
    color: white;
`

const CompleteTask = styled.div`
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 5px 15px;
    border-radius: 5px;
    display: inline-block;
    color: #fff;
    background-color: #0061b5;
    margin-right: 5px;
`;

const TagHolder = styled.div`
    width: 100%;
    height: 100px;
    overflow: scroll;
    background: #fff;
    border: 1px solid #1e1e1e;
`;

const PossibleTags = styled.div`
    width: 100%;
    max-height: 100px;
    overflow: scroll;
`

const Tag = styled.div`
    cursor: pointer;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
    color: #fff;
    background-color: #0061b5;
    margin-right: 5px;
    margin-bottom: 5px;
    ${({disabled}) => disabled && `
        display: none;
  `}
`;

class AfterCallPopup extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            possibleTags: [
            ],
            selectedTags: ['No pay - not right now'],
            category: '',
            description: '',
            searchQuery: '',
        };
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount() {
        fetch(`https://peach-uguisu-5468.twil.io/GetTags`)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        possibleTags: result.tags
                    })
                });
    }

    handleDescriptionChange(event){
        this.setState({description: event.target.value});
    }

    handleCategoryChange(event){
        this.setState({category: event.target.value});
    }

    handleSearchChange(event){
        this.setState({searchQuery: event.target.value});
    }

    addTag(tag){
        this.setState(state => {
            const selectedTags = state.selectedTags.concat(tag);
            return {
                selectedTags
            };
        });
    }

    removeTag(tag){
        let i = this.state.selectedTags.indexOf(tag);
        this.setState(state => {
            const selectedTags = state.selectedTags.filter((item, j) => i !== j);

            return {
                selectedTags,
            };
        });
    }

    renderPossibleTags(){
        let tags = [];
        for (let i = 0; i < this.state.possibleTags.length; i++) {
            let tag = this.state.possibleTags[i];
            tags.push(
                <Tag key={`possible_${tag}`} disabled={(this.state.selectedTags.includes(tag) || (!tag.toUpperCase().includes(this.state.searchQuery.toUpperCase())))} onClick={()=>{this.addTag(tag)}}>{tag}</Tag>
            )
        }
        return tags;
    }

    renderSelectedTags(){
        let tags = [];
        for (let i = 0; i < this.state.selectedTags.length; i++) {
            let tag = this.state.selectedTags[i];
            tags.push(
                <Tag key={`selected_${tag}`} onClick={()=>{this.removeTag(tag)}}>{tag} &times;</Tag>
            )
        }
        return tags;
    }

    completeTask(){
        Actions.invokeAction("CompleteTask", { sid: this.props.sid  });
    }

    render(){
        return(<Background>

            <PopUp>
                <PopupHeader>
                    <h2>After Call Work</h2>
                </PopupHeader>
                <PopupBody>
                    <p>Please fill in the information about this call</p>
                    <label>Set a category for call:
                    </label>
                    <select value={this.state.category} onChange={this.handleCategoryChange}>
                        <option value='Promise - payment in full'>Promise - payment in full</option>
                        <option value='Promise - Payment Plan'>Promise - Payment Plan</option>
                        <option value='Promise - Settlement in Full'>Promise - Settlement in Full</option>
                        <option value='Promise - Settlement in payments'>Promise - Settlement in payments</option>
                    </select>
                    <label>Write a description call:</label>
                    <textarea value={this.state.description} onChange={this.handleDescriptionChange}/>
                    <label>Tags for this call:</label>
                    <TagHolder>{this.renderSelectedTags()}</TagHolder>
                    <label>Choose from the following:</label>
                    <input value={this.state.searchQuery} placeholder='Search for tags' type='text' onChange={this.handleSearchChange}/>
                    <PossibleTags>
                        {this.renderPossibleTags()}
                    </PossibleTags>
                </PopupBody>
                <PopupFooter>
                    <CompleteTask onClick={this.completeTask}>
                        Complete Task
                    </CompleteTask>
                </PopupFooter>
            </PopUp>

        </Background>)
    }
}

export default AfterCallPopup