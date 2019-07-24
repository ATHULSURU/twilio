import { Actions, Manager } from '@twilio/flex-ui';

export const setListeners = () => {
    Manager.getInstance().workerClient.on("reservationCreated", reservation => {
            Actions.invokeAction("AcceptTask", { sid: reservation.sid });
            Actions.invokeAction("SelectTask", { sid: reservation.sid });
    });
};

export default setListeners;