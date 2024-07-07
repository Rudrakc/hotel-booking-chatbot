-- SQLite
SELECT id, userId, message, response, createdAt, updatedAt
FROM Conversations
order by createdAt desc;
