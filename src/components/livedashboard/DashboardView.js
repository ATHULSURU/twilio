import React from 'react';
import styled from 'styled-components'
import {personIcon} from "../../icons";

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    padding: 50px 0;
`;

const StatItem = styled.div`
    width: 25%;
    height: 100px;
    text-align: center;
    & svg{
        height: 80px;
        width: 80px;
    }
`

const LargeNumber = styled.h1`
    font-size: 48px!important;
    color: #434343;
`

class DashboardView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tasksInQueue: 0,
            averageWaiting: 0,
            longestWaiting: 0,
            callsAnswered: 0,
            callsAbandonedMissed: 0,
            workerStatistics: [],
        };
        this.prettyPrintTime = this.prettyPrintTime.bind(this);
    }

    prettyPrintTime(seconds) {
        let remainingSecs = seconds % 60;
        const minutes = Math.round((seconds - remainingSecs) / 60);
        return `${minutes} : ${(Math.round(remainingSecs) > 9) ? Math.round(remainingSecs) : ('0' + Math.round(remainingSecs.toString()))}`
    }

    async componentDidMount() {
        try {


            this.getStats = setInterval(async () => {
                const res = await fetch(`https://peach-uguisu-5468.twil.io/GetStats`);
                const result = await res.json();
                const stats = result.stats;

                /* used for calculations */
                const totalCalls = stats.cumulative.reservations_accepted + stats.cumulative.reservations_timed_out + stats.cumulative.reservations_canceled;


                /* final values */
                const tasksInQueue = stats.realtime.tasks_by_status.pending + stats.realtime.tasks_by_status.reserved;
                const averageWaiting = stats.cumulative.avg_task_acceptance_time;
                const longestWaiting = stats.realtime.longest_task_waiting_age;
                let callsAnswered, callsAbandonedMissed;
                if(totalCalls === 0){
                    callsAnswered = 100;
                    callsAbandonedMissed = 0;
                } else {
                    callsAnswered = (stats.cumulative.reservations_accepted/totalCalls) * 100;
                    callsAbandonedMissed = ((stats.cumulative.reservations_timed_out + stats.cumulative.reservations_canceled)/totalCalls) * 100;
                }

                const workerStatistics = stats.realtime.activity_statistics;


                this.setState({
                    tasksInQueue: tasksInQueue,
                    averageWaiting: averageWaiting,
                    longestWaiting: longestWaiting,
                    callsAnswered: callsAnswered,
                    callsAbandonedMissed: callsAbandonedMissed,
                    workerStatistics: workerStatistics,
                })

            }, 5000);
        } catch(e) {
            console.log(e);
        }
    }

    componentWillUnmount(){
        clearInterval(this.getStats);
    }

    createWorkerTable(){
        let table = [];
        for (let i = 0; i < this.state.workerStatistics.length; i++) {
            table.push(<div>{this.state.workerStatistics[i].friendly_name} : <span>{this.state.workerStatistics[i].workers}</span></div>)
        }
        return table;
    }

    render(){
        return (<Wrapper>
            <StatItem>
                <h1>Tasks in queues</h1>
                <LargeNumber>{this.state.tasksInQueue}</LargeNumber>
            </StatItem>
            <StatItem>
                <h1>Average Waiting:</h1>
                <LargeNumber>{this.state.averageWaiting}</LargeNumber>
            </StatItem>
            <StatItem>
                <h1>Longest waiting:</h1>
                <LargeNumber>{this.state.longestWaiting}</LargeNumber>
            </StatItem>
            <StatItem>
                <h1>Calls Answered:</h1>
                <LargeNumber>{this.state.callsAnswered}%</LargeNumber>
            </StatItem>
            <StatItem>
                <h1>Calls Missed or Abandoned:</h1>
                <LargeNumber>{this.state.callsAbandonedMissed}%</LargeNumber>
            </StatItem>
            <StatItem>
                <h1>Worker Activities:</h1>
                {this.createWorkerTable()}
            </StatItem>
        </Wrapper>)
    }
}

export default  DashboardView