const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Example: Respond to a specific keyword
    if (message.content.toLowerCase().includes('hello')) {
      await message.channel.send(`Hello, ${message.author.username}!`);
    }
  },
};
