import type { Client } from "discord.js";
import type { createScoreService } from "../db/ScoresService.js";

type ScoreService = ReturnType<typeof createScoreService>;

type User = {
	id: string;
	metadata: {
		name: string | null;
		nickname: string | null;
		username: string;
	};
	score: number;
};

export class UserRegistry {
	private users: Map<string, User> = new Map();

	addUser(user: User) {
		this.users.set(user.id, user);
	}

	getUser(id: string) {
		return this.users.get(id);
	}

	getSize() {
		return this.users.size;
	}
}

export async function fetchUsers(
	client: Client,
	scoreService: ScoreService,
): Promise<UserRegistry> {
	const userRegistry = new UserRegistry();

	try {
		const guild = await client.guilds.fetch(process.env.GUILD_ID);
		const members = await guild.members.fetch();

		members
			.filter((member) => !member.user.bot)
			.forEach((human) => {
				// Ensure user exists in the DB
				scoreService.upsertUser(human.id, human.user.username);

				userRegistry.addUser({
					id: human.id,
					metadata: {
						name: human.user.globalName ?? null,
						nickname: human.nickname ?? null,
						username: human.user.username,
					},
					score: scoreService.getScore(human.id),
				});
			});
	} catch (err) {
		console.error("Failed to fetch members:", err);
	}

	return userRegistry;
}
