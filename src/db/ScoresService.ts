import type { Database } from "better-sqlite3";
import { getDb } from "./factory.js";

export interface ScoreRow {
	user_id: string;
	username: string;
	score: number;
}

export function createScoreService(db: Database = getDb()) {
	return {
		/**
		 * Insert a new user or update their username if they already exist.
		 * Called when the bot starts up and when a new member joins.
		 */
		upsertUser(userId: string, username: string): void {
			db.prepare(`
        INSERT INTO scores (user_id, username)
        VALUES (?, ?)
        ON CONFLICT (user_id) DO UPDATE SET username = excluded.username
      `).run(userId, username);
		},

		/**
		 * Add points to a user's score.
		 * Amount can be negative to subtract points.
		 */
		addScore(userId: string, amount: number): void {
			db.prepare(`
        UPDATE scores
        SET score      = score + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(amount, userId);
		},

		/**
		 * Get a single user's current score.
		 * Returns 0 if the user isn't in the database yet.
		 */
		getScore(userId: string): number {
			const row = db
				.prepare(`
        SELECT score FROM scores WHERE user_id = ?
      `)
				.get(userId) as { score: number } | undefined;

			return row?.score ?? 0;
		},

		/**
		 * Get the top N users by score, defaulting to top 10.
		 */
		getLeaderboard(limit = 10): ScoreRow[] {
			return db
				.prepare(`
        SELECT user_id, username, score
        FROM scores
        ORDER BY score DESC
        LIMIT ?
      `)
				.all(limit) as ScoreRow[];
		},

		/**
		 * Reset a user's score back to 0.
		 * Useful for admin commands.
		 */
		resetScore(userId: string): void {
			db.prepare(`
        UPDATE scores
        SET score      = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(userId);
		},

		/**
		 * Remove a user from the scores table.
		 * Called when a member leaves the server.
		 */
		removeUser(userId: string): void {
			db.prepare(`
        DELETE FROM scores WHERE user_id = ?
      `).run(userId);
		},
	};
}

// Default singleton instance for use throughout the app
export const ScoreService = createScoreService();
