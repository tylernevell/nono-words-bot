import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ScoreService } from "../db/ScoresService.js";
import type { Command } from "./index.js";

export default {
	data: {
		name: "rank",
		description: "See your score or another user's score",
		options: [
			{
				name: "user",
				description: "The user to check (defaults to you)",
				type: ApplicationCommandOptionType.User,
				required: false,
			},
		],
	},
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const target = interaction.options.getUser("user") ?? interaction.user;
			const score = ScoreService.getScore(target.id);

			const board = ScoreService.getLeaderboard(20);
			const rank = board.findIndex((row) => row.user_id === target.id) + 1;
			const rankDisplay = rank > 0 ? `#${rank}` : "Unranked";

			const embed = new EmbedBuilder()
				.setTitle(`${target.displayName}'s Rank`)
				.setThumbnail(target.displayAvatarURL())
				.setColor(0xf5a623)
				.addFields(
					{ name: "Score", value: `${score} pts`, inline: true },
					{ name: "Rank", value: rankDisplay, inline: true },
				)
				.setTimestamp();

			await interaction.reply({ embeds: [embed] });
		}
	},
} satisfies Command;
