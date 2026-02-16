import { EmbedBuilder } from "discord.js";
import { ScoreService } from "../db/ScoresService.js";
import type { Command } from "./index.js";

const medals = ["🥇", "🥈", "🥉"];

export default {
	data: {
		name: "leaderboard",
		description: "See everyone's scores",
	},
	async execute(interaction) {
		const board = ScoreService.getLeaderboard(20);

		if (board.length === 0) {
			await interaction.reply({
				content: "No scores yet — start chatting!",
				ephemeral: true,
			});
			return;
		}

		const description = board
			.map((row, i) => {
				const prefix = medals[i] ?? `**${i + 1}.**`;
				return `${prefix} ${row.username} — ${row.score} pts`;
			})
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("🏆 Leaderboard")
			.setDescription(description)
			.setColor(0xf5a623)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
} satisfies Command;
