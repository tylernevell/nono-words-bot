import process from "node:process";
import { URL } from "node:url";
import { Client, GatewayIntentBits } from "discord.js";
import { getDb } from "./db/factory.js";
import { createScoreService } from "./db/ScoresService.js";
import { loadEvents } from "./util/loaders.js";

// Initialize DB first — schema is created inside createDb()
const db = getDb();
const scoreService = createScoreService(db);

const leaderboard = scoreService.getLeaderboard();
console.log(leaderboard);

// Initialize the client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

// Load the events and commands
const events = await loadEvents(new URL("events/", import.meta.url));

// Register the event handlers
for (const event of events) {
	console.log(`Registering event ${event.name}`);
	client[event.once ? "once" : "on"](event.name, async (...args) => {
		try {
			await event.execute(...args);
		} catch (error) {
			console.error(`Error executing event ${String(event.name)}:`, error);
		}
	});
}

// Login to the client
void client.login(process.env.DISCORD_TOKEN);
