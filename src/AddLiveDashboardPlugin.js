import { FlexPlugin } from 'flex-plugin';
import { View } from '@twilio/flex-ui';
import { combineReducers } from 'redux';
import trueReducer from './reducer'
import setListeners from './Listeners';
import React from 'react';
import LiveDashboardButton from './components/livedashboard/LiveDashboardButton'
import DashboardView from './components/livedashboard/DashboardView'
import CommunicationsHistory from "./components/agentView/CommunicationsHistory";
import CustomerExplorer from "./components/agentView/CustomerExplorer";
import AgentView from "./components/agentView/AgentView";
import {Actions} from "@twilio/flex-ui";
import AfterCallPopup from "./components/agentView/AfterCallPopup";

const PLUGIN_NAME = 'AddLiveDashboardPlugin';

export default class AddLiveDashboardPlugin extends FlexPlugin {
    constructor() {
        super(PLUGIN_NAME);
    }

    /**
     * This code is run when your plugin is being started
     * Use this to modify any UI components or attach to the actions framework
     *
     * @param flex { typeof import('@twilio/flex-ui') }
     * @param manager { import('@twilio/flex-ui').Manager }
     */
    init(flex, manager) {
        manager.store.replaceReducer(combineReducers({ flex: flex.FlexReducer, trueReducer: trueReducer }));
        setListeners();

        flex.AgentDesktopView.Panel2.Content.remove('container');


        flex.SideNav.Content.add(
            <LiveDashboardButton key="live-dashboard-button"/>
        );
        flex.ViewCollection.Content.add(
            <View name="live-dashboard" key="live-dashboard">
                <DashboardView/>
            </View>
        );

        Actions.replaceAction('AcceptTask', (payload, original) => {
            return new Promise((resolve, reject) => {
                if (payload && payload.task) {
                    flex.AgentDesktopView.Panel2.Content.add(
                        <AgentView key={`agentView_${payload.task.sid}`}/>
                    );
                }
                resolve();
            }).then(() => original(payload));
        });

        Actions.replaceAction('HangupCall', (payload, original) => {
            return new Promise((resolve, reject) => {
                if (payload && payload.task) {
                    flex.AgentDesktopView.Panel2.Content.add(
                        <AfterCallPopup key={`popup_${payload.task.sid}`} sid={payload.task.sid}/>
                    );
                }
                resolve();
            }).then(() => original(payload));
        });

        Actions.replaceAction('CompleteTask', (payload, original) => {
            return new Promise((resolve, reject) => {
                if (payload && payload.task) {
                flex.AgentDesktopView.Panel2.Content.remove(`popup_${payload.task.sid}`);
                flex.AgentDesktopView.Panel2.Content.remove(`agentView_${payload.task.sid}`);
            }
            resolve();
        }).then(() => original(payload));
        });

        flex.AgentDesktopView.Panel2.Content.add(
            <AfterCallPopup key={`popup_${'0'}`} sid={'0'}/>
        );

    }
        

}
