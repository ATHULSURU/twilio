import React from 'react';
import styled from 'styled-components'
import {historyIcon} from "../../icons";

const Wrapper = styled.div`
    width: 250px;
    height: 100%;
    overflow: scroll;
    border-left: solid 1px #bfbfbf;
`;

const HistoryItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    width: 100%;
    border-bottom: solid 1px #bfbfbf;
    background-color: rgba(242,249,255,.9);
`;

const TagHolder = styled.div`
    max-height: 100px;
    overflow-y: scroll;
    width: 100%;
`;

const Tag = styled.div`
    font-weight: 600;
    padding: 0 10px;
    border-radius: 5px;
    display: inline-block;
    color: #fff;
    background-color: #0061b5;
    margin-right: 5px;
`;

const Toggle = styled.div`
    color: #fff;
    text-align: center;
    background-color: #50be4c;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 400;
    position: fixed;
    right: 0;
    top: 50%;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
    margin: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    & svg path{
        fill: #fff;
    }
`;

const Header = styled.div`
    background-color: #0074d9;
    width: 100%;
    padding: 10px 0;
    text-align: center;
    color: #fff;
    font-size: 16px;
`;

const CloseButton = styled.div`
    cursor: pointer;
`;

class CommunicationsHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            history: [
                {
                    id: 0,
                    name: 'Danny Called',
                    description: 'Danny called to make a payment',
                    date: '07/15/19',
                    tags: [
                        'Inbound',
                        'payment'
                    ]
                },
                {
                    id: 1,
                    name: 'Danny was called',
                    description: 'Danny called to make a payment',
                    date: '07/15/19',
                    tags: [
                        'Inbound',
                        'payment'
                    ]
                },
                {
                    id: 2,
                    name: 'Danny Called',
                    description: 'Danny called to make a payment',
                    date: '07/15/19',
                    tags: [
                        'Inbound',
                        'payment'
                    ]
                }
            ]
        };
    }

    renderHistoryItems(){
        let items = [];
        for (let i = 0; i < this.state.history.length; i++) {
            let historyItem = this.state.history[i];
            let tags = [];

            for (let j = 0; j < historyItem.tags.length; j++) {
                tags.push(<Tag>{historyItem.tags[j]}</Tag>)
            }

            items.push(<HistoryItem key={historyItem.id}>
                <div>
                    <h1>{historyItem.name}</h1>
                    <h2>{historyItem.date}</h2>
                    <p>{historyItem.description}</p>
                    <TagHolder>
                        {tags}
                    </TagHolder>
                </div>
            </HistoryItem>)
        }
        return items;
    }

    render(){
        if(this.state.active){
            return(
                <Wrapper>
                    <Header> Communications History <CloseButton onClick={()=> {
                        this.setState({active: false})
                    }}> &times;</CloseButton></Header>
                    {this.renderHistoryItems()}
                </Wrapper>
            )
        } else {
            return(
                    <Toggle onClick={()=> {
                        this.setState({active: true})
                    }}>Open History {historyIcon}</Toggle>
                )
        }
    }
}

export default CommunicationsHistory