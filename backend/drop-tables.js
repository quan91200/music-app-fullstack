import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dropTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Disabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    const tables = [
      'favorites', 'playlist_songs', 'player_histories', 'player_queues',
      'playlists', 'songs', 'users', 'Users', 'User',
      'song_favorites', 'PlaylistSongs', 'Favorites'
    ];
    for (const table of tables) {
      console.log(`Dropping table ${table}...`);
      await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
    }

    console.log('Enabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('All tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await connection.end();
  }
};

dropTables();
