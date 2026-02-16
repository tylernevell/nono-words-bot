import { Events, type Message } from "discord.js";
import { ScoreService } from "../db/ScoresService.js";
import type { Event } from "./index.js";

// In-memory cooldown map — prevents point farming from rapid messages
// Key: userId, Value: timestamp of last award
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 60_000; // 1 minute

export default {
	name: Events.MessageCreate,
	async execute(message: Message) {
		// Ignore bots and DMs
		if (message.author.bot) return;
		if (!message.inGuild()) return;

		const userId = message.author.id;
		const now = Date.now();
		const lastAwarded = cooldowns.get(userId) ?? 0;

		if (now - lastAwarded < COOLDOWN_MS) return;

		cooldowns.set(userId, now);
		ScoreService.addScore(userId, 1);

		console.log(
			`Awarded 1 point to ${message.author.username} for message: ${message.content}`,
		);
		console.log("--------------------------------");
		console.log(ScoreService.getLeaderboard());
		console.log("--------------------------------");
	},
} satisfies Event<Events.MessageCreate>;
