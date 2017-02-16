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
    app.post("/message/:id", (req,res) => {
      channel.publish("hipchat_messages", req.params.id, new Buffer(JSON.stringify(req.body)));
      console.info(`Published message on channel ${req.params.id}`);
      res.sendStatus(200);
    });
    
    const server = Http.createServer(app);
    server.listen(3000, () => console.info("Server Running"));
  });
});