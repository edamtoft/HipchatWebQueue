const Amqp = require("amqplib/callback_api");
const Express = require("express");
const BodyParser = require("body-parser");
const Http = require("http");

Amqp.connect(process.env.AMQP_CONN, (err,conn) => {
  if (err) throw err;

  conn.createChannel((err, channel) => {
    if (err) throw err;

    const app = new Express();
    
    app.use(BodyParser.json());
    app.post("/message", (req,res) => channel.publish("hipchat_messages", req.body.webhook_id, new Buffer(JSON.stringify(req.body))));
    
    const server = Http.createServer(app);
    server.listen()
  });
});