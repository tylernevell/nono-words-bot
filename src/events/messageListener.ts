import { Events, type Message } from "discord.js";

const botTestingChannelId = "1465448493131890905";

export default {
	name: Events.MessageCreate,
	async execute(message: Message) {
		console.log(`Message received: ${message.content}`);
		// Ignore messages from bots
		if (message.author.bot) return;
		if (message.channel.id !== botTestingChannelId) return;
		if (message.channel.isDMBased()) return;

		if (message.content.toLowerCase().includes("hello")) {
			await message.channel.send(`Hello, ${message.author.username}!`);
		}
	},
};
