import React from 'react';
import styled from 'styled-components'
import CustomerExplorer from "./CustomerExplorer";
import CommunicationsHistory from "./CommunicationsHistory";

const Wrapper = styled.div`display: flex; height: 100%;`;

class AgentView extends React.Component{
    render(){
        return(
                <Wrapper>
                    <CustomerExplorer/>
                    <CommunicationsHistory/>
                </Wrapper>
            )
    }
}

export default AgentView