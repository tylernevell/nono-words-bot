// Import the necessary discord.js classes

// import { token } from '../config.json' with { type: 'json' };
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Collection, GatewayIntentBits } from "discord.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();
// ?might have to disable for product monitors?
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Load commands dynamically
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		// Convert file:// URL to import path
		const importPath = `file://${filePath.replace(/\\/g, "/")}`;

		try {
			const command = await import(importPath);
			// Set a new item in the Collection with the key as the command name and value as the exported module
			if ("data" in command.default && "execute" in command.default) {
				client.commands.set(command.default.data.name, command.default);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		} catch (error) {
			console.error(`Error loading command ${filePath}:`, error);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

// Load event handlers dynamically
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const importPath = `file://${filePath.replace(/\\/g, "/")}`;

	try {
		const event = await import(importPath);
		if (event.default.once) {
			client.once(event.default.name, (...args) =>
				event.default.execute(...args),
			);
		} else {
			client.on(event.default.name, (...args) =>
				event.default.execute(...args),
			);
		}
	} catch (error) {
		console.error(`Error loading event ${filePath}:`, error);
	}
}

// Log in to Discord with client's token
client.login(process.env.TOKEN);
