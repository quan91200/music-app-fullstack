/**
 * @fileoverview Database configuration (Class-based).
 * @module shared/config/database
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton Database Connection Class.
 */
class Database {
  constructor() {
    const {
      DB_HOST,
      DB_PORT,
      DB_NAME,
      DB_USER,
      DB_PASS,
      NODE_ENV
    } = process.env;

    this.sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      host: DB_HOST,
      port: DB_PORT || 25588,
      dialect: 'mysql',
      logging: NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  /**
   * Test the database connection.
   */
  async authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Aiven MySQL connection has been established successfully.');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      process.exit(1);
    }
  }

  /**
   * Get the Sequelize instance.
   */
  getInstance() {
    return this.sequelize;
  }
}

const db = new Database();
export const connectDB = () => db.authenticate();
export default db.getInstance();
