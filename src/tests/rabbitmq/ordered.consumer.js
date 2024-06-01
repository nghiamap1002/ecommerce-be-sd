"use strict";

const amqp = require("amqplib");

const consumerOrderedMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";

    channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();

      setTimeout(() => {
        console.log("processed:", message);
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.log(error, error);
  }
};

consumerOrderedMessage().catch((err) => console.log(err, "err"));
