import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
    flex: 1;
    height: 100%;
    & iframe{
        height: 100%;
        width: 100%;    
    }
`;

class CustomerExplorer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
        this.updateTags = this.updateTags.bind(this);
    }

    updateTags(){

    }

    render(){
        return(
                <Wrapper>
                    <iframe src='https://www.bing.com'/>
                </Wrapper>
            )
    }
}

export default CustomerExplorer