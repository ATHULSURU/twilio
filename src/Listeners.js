import { Actions, Manager } from "@twilio/flex-ui";

export const setListeners = () => {
  let conferenceSid;
  Manager.getInstance().workerClient.on("reservationCreated", reservation => {
    Actions.registerAction("Updateconference", () => {
      return fetch(
        `https://almond-lionfish-9759.twil.io/conference-call?conferenceSid=${conferenceSid}`
      )
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    });
    Actions.registerAction("FechConference", () => {
      return fetch(
        `https://almond-lionfish-9759.twil.io/fetch-conference?conferenceSid=${conferenceSid}`
      ).then(response => {
        fetch(
          `https://3jru87f8hd.execute-api.us-west-2.amazonaws.com/v1/customer-interaction`,
          {
            method: "POST",
            headers: {
              Authorization: "Basic am9yZGFuIDogaGVyZQ==",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(response)
          }
        );
      });
    });

    Actions.invokeAction("AcceptTask", { sid: reservation.sid });
    Actions.invokeAction("SelectTask", { sid: reservation.sid });
    Actions.addListener("afterAcceptTask", payload => {
      setTimeout(() => {
        conferenceSid = payload.task.attributes.conference.sid;
        return Actions.invokeAction("Updateconference");
      }, 3000);
    });
    Actions.addListener("afterCompleteTask", payload => {
        const base64 = require('base-64');
        let username = 'jordan';
        let password = 'here';
        let data = payload.task.attributes;
        console.log(data);
        fetch(
            `https://3jru87f8hd.execute-api.us-west-2.amazonaws.com/v1/customer-interaction`,
            {
                method: "POST",
                headers: {
                    "Authorization": 'Basic ' + base64.encode(username + ":" + password),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
    });
  });
};
export default setListeners;
