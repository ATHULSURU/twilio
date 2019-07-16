import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

const LiveDashboardButton = ({ activeView }) => {
    function  navigate() {
        Actions.invokeAction('NavigateToView', { viewName: 'live-dashboard' })
    }

    return (
        <SideLink
            showLabel = {true}
            icon = "Supervisor"
            iconActive = "SupervisorBold"
            isActive = {activeView === 'live-dashboard'}
            onClick={navigate}>
            Live Dashboard
        </SideLink>
    )
};

export default LiveDashboardButton;