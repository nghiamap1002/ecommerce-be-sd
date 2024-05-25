const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    const message = "con cho minhanh";

    // create queue
    await channel.assertQueue(queueName, {
      durable: true,
    });
    await channel.consume(
      queueName,
      (message) => {
        console.log(message.content.toString(), "message");
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error, error);
  }
};

runConsumer().catch((err) => console.log(err));
