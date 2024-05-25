const { Kafka, Partitioners, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Helo concho" }],
  });

  await producer.disconnect();
};

runProducer().catch((err) => console.log(err));
