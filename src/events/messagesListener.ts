import { Events, type Message } from "discord.js";

export default {
	name: Events.MessageCreate,
	async execute(message: Message) {
		if (message.author.bot) return;
		if (message.channel.isDMBased()) return;

		if (message.content.toLowerCase().includes("hello")) {
			await message.channel.send(`Hello, ${message.author.username}!`);
		}
	},
};
