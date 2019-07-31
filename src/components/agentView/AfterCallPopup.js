import React from "react";
import styled from "styled-components";
import {Actions, Manager} from "@twilio/flex-ui";

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
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

const PopUp = styled.div`
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 100; /* Sit on top */
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 45%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  & label {
    display: block;
    margin: 10px 0 5px;
    font-size: 14px;
    font-weight: 500;
  }
  & textarea {
    width: 100%;
    height: 100px;
  }
`;

const PopupHeader = styled.div`
  padding: 5px 60px;
  background-color: #5cb85c;
  color: white;
  & h2{
    font-size: 16px;
  }
`;

const PopupBody = styled.div`
  padding: 15px 60px;
`;

const PopupFooter = styled.div`
  padding: 5px 60px;
  background-color: #5cb85c;
  color: white;
`;

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
`;

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
  ${({disabled}) =>
    disabled &&
    `
        display: none;
  `}
`;

class AfterCallPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promiseTags: [],
            commitmentTags: [],
            noPayTags: [],
            otherTags: [],
            selectedTags: [],
            category: "select disposition",
            description: "",
            searchQuery: "",
            count: 0,
            time: "",
            error: {descriptionError: "", tagError: ""}
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
            .then(result => {
                this.setState({
                    promiseTags: result.promise,
                    commitmentTags: result.commitment,
                    noPayTags: result.noPay,
                    otherTags: result.other
                });
            });
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    tick() {
        var hour = Math.floor(this.state.count / 3600);
        var minute = Math.floor((this.state.count - hour * 3600) / 60);
        var seconds = this.state.count - (hour * 3600 + minute * 60);
        this.setState({
            count: this.state.count + 1,
            time: minute + ":" + ((seconds > 9) ? seconds : ('0' + seconds.toString(10)))
        });
    }

    validate = () => {
        let descriptionError = "";
        let tagError = "";
        let categoryError = "";

        if (!this.state.description) {
            descriptionError = "*you must fill in the description";
        }
        if (!this.state.selectedTags.length) {
            tagError = "*atleast one tag must be selected";
        }
        if (this.state.category === 'select disposition') {
            categoryError = "*you must set a disposition";
        }
        const error = this.state.error;
        error["decsError"] = descriptionError;
        error["tagError"] = tagError;
        error["categoryError"] = categoryError;
        if (descriptionError || tagError) {
            this.setState({error});

            return false;
        }
        return true;
    };

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    handleCategoryChange(event) {
        this.setState({category: event.target.value});
    }

    handleSearchChange(event) {
        this.setState({searchQuery: event.target.value});
    }

    addTag(tag) {
        this.setState(state => {
            const selectedTags = state.selectedTags.concat(tag);
            return {
                selectedTags
            };
        });
    }

    removeTag(tag) {
        let i = this.state.selectedTags.indexOf(tag);
        this.setState(state => {
            const selectedTags = state.selectedTags.filter((item, j) => i !== j);

            return {
                selectedTags
            };
        });
    }

    renderPossibleTags(tagArray) {
        let tags = [];
        for (let i = 0; i < tagArray.length; i++) {
            let tag = tagArray[i];
            tags.push(
                <Tag
                    key={`possible_${tag}`}
                    disabled={
                        this.state.selectedTags.includes(tag) ||
                        !tag.toUpperCase().includes(this.state.searchQuery.toUpperCase())
                    }
                    onClick={() => {
                        this.addTag(tag);
                    }}
                >
                    {tag}
                </Tag>
            );
        }
        return tags;
    }

    renderSelectedTags() {
        let tags = [];
        for (let i = 0; i < this.state.selectedTags.length; i++) {
            let tag = this.state.selectedTags[i];
            tags.push(
                <Tag
                    key={`selected_${tag}`}
                    onClick={() => {
                        this.removeTag(tag);
                    }}
                >
                    {tag} &times;
                </Tag>
            );
        }
        return tags;
    }

    completeTask() {
        const isValid = this.validate();
        if (isValid) {
            console.log(this.state);
            Actions.invokeAction("CompleteTask", {sid: this.props.sid});
            clearInterval(this.state.count, this.state.time);
            this.setState({count: 0});
        }
    }

    render() {
        return (
            <PopUp>
                <PopupHeader>
                    <h2>After Call Work {this.state.time}</h2>
                </PopupHeader>

                <PopupBody>
                    <label>Write a description call:</label>
                    <textarea
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                    />
                    <div style={{color: "red"}}> {this.state.error.decsError}</div>
                    <label>Set a disposition:</label>
                    <select
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                    >
                        <option value="select disposition">Select disposition</option>
                        <option value="promise">
                            Promise
                        </option>
                        <option value="commitment">
                            Commitment
                        </option>
                        <option value="noPay">
                            No Pay
                        </option>
                        <option value="other">
                            Other
                        </option>
                    </select>
                    <div style={{color: "red"}}>{this.state.error.categoryError}</div>

                    <label>Tags for this call:</label>
                    <TagHolder>{this.renderSelectedTags()}</TagHolder>
                    <div style={{color: "red"}}>{this.state.error.tagError}</div>
                    <label>Choose from the following:</label>
                    <input
                        value={this.state.searchQuery}
                        placeholder="Search for tags"
                        type="text"
                        onChange={this.handleSearchChange}
                    />
                    {(this.state.category === 'promise') &&
                    <PossibleTags>{this.renderPossibleTags(this.state.promiseTags)}</PossibleTags>}
                    {(this.state.category === 'commitment') &&
                    <PossibleTags>{this.renderPossibleTags(this.state.commitmentTags)}</PossibleTags>}
                    {(this.state.category === 'noPay') &&
                    <PossibleTags>{this.renderPossibleTags(this.state.noPayTags)}</PossibleTags>}
                    {(this.state.category === 'other') &&
                    <PossibleTags>{this.renderPossibleTags(this.state.otherTags)}</PossibleTags>}
                </PopupBody>
                <PopupFooter>
                    <CompleteTask onClick={this.completeTask}>
                        Complete Task
                    </CompleteTask>
                </PopupFooter>
            </PopUp>
        );
    }
}

export default AfterCallPopup;
