import type { Command } from "../index.js";

export default {
	async execute(interaction) {
		await interaction.reply(
			`This command was run by ${interaction.user.username}.`,
		);
	},
	data: {
		name: "user",
		description: "Provides information about the user.",
	},
} satisfies Command;
