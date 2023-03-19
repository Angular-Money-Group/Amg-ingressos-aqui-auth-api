import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

export const connection = () => {
    pool.getConnection((error, connection) => {
        if (error) throw error;
        console.log("Connected to database!");
        connection.release();
      });
}

export const query = async(sql: string, values: any): Promise<any> => {
    return await new Promise(async (resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err)
                return reject(err);
            resolve(results);
        });
    });
}

export default { connection, query };