const amqp = require("amqplib");

const connectRabbit = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
  } catch (error) {
    console.log(error, error);
  }
};

const connectRabbitTest = async () => {
  try {
    const { channel, connection } = connectRabbit();

    const queueName = "test-topic";
    const message = "con cho minhanh";
    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.log(error, error);
  }
};

runProducer().catch((err) => console.log(err));
