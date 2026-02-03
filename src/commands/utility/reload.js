import { SlashCommandBuilder } from "discord.js";

// The reload command ideally should not be used by every user. You should deploy it as a guild command in a private guild.
export default {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads a command.")
		.addStringOption((option) =>
			option
				.setName("commnad")
				.setDescription("The command to reload.")
				.setRequired(true),
		),
	async execute(interaction) {
		const commandName = interaction.options
			.getString("commnad", true)
			.toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(
				`There is no command with name \`${commandName}\`!`,
			);
		}

		try {
			const newCommand = (await import(`./${command.data.name}.js`)).default;
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`,
			);
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
			);
		}
	},
};
