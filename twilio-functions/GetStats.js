exports.handler = function (context, event, callback) {
    const client = context.getTwilioClient();
    let Response = new Twilio.Response();

    Response.setStatusCode(200);

    // Set the Headers
    Response.appendHeader('Content-Type', 'application/json');
    Response.appendHeader('Access-Control-Allow-Origin', '*');


    client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
        .taskQueues(event.queue)
        .statistics()
        .fetch()
        .then(task_queue_statistics => {
            Response.setBody({
                stats: task_queue_statistics
            });
            callback(null, Response);
        });
};