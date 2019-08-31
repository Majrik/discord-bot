module.exports = (client, e) => {
  console.error("*error*");
  client.emit("ready");
};