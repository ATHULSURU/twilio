import { FlexPlugin } from 'flex-plugin';
import { View } from '@twilio/flex-ui';
import { combineReducers } from 'redux';
import trueReducer from './reducer'
import setListeners from './Listeners';
import React from 'react';
import LiveDashboardButton from './components/livedashboard/LiveDashboardButton'
import DashboardView from './components/livedashboard/DashboardView'

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



        flex.SideNav.Content.add(
            <LiveDashboardButton key="live-dashboard-button"/>
        );
        flex.ViewCollection.Content.add(
            <View name="live-dashboard" key="live-dashboard">
                <DashboardView/>
            </View>
        );
    }
}
