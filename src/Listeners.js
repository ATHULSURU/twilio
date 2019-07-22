import { Actions, Manager } from "@twilio/flex-ui";

export const setListeners = () => {
  Manager.getInstance().workerClient.on("reservationCreated", reservation => {
    if (reservation.task.taskChannelUniqueName === "voice") {
      Actions.invokeAction("AcceptTask", { sid: reservation.sid });
    }
  });
};

export default setListeners;
