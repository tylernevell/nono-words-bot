import { Events } from "discord.js";
import { ScoreService } from "../db/ScoresService.js";
import { fetchUsers } from "../scoring/user-registry.js";
import type { Event } from "./index.js";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const registry = await fetchUsers(client, ScoreService);
		console.log(`Seeded ${registry.getSize()} users`);
	},
} satisfies Event<Events.ClientReady>;
