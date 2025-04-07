const db = require("mysql2/promise");

require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
const initalizedDB = async () => {
  try {
    const initialConnection = await db.createConnection({
      host: DB_HOST || "localhost",
      user: DB_USER,
      password: DB_PASS,
    });
    await initialConnection.query(
      `Create Database If not Exists \`${DB_NAME}\``
    );
    console.log(`Database ${DB_NAME} is ready!!!`);
    await initialConnection.end();
    const dbPool = db.createPool({
      host: DB_HOST || "localhost",
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    await dbPool.query(`Create Table if not Exists users( 
        id int Auto_Increment Primary Key,
        fullName Varchar(255) not null,
        email Varchar(255) not null,
        password Varchar(255) not null,
        created_at TimeStamp DefaulT Current_Timestamp)`);
    console.log("Table users created");

    await dbPool.query(`Create Table if not Exists tasks(
        id int Auto_Increment Primary Key,
        user_id int not null,  
        title Varchar(255) not null,
        description text,
        created_at TimeStamp Default Current_Timestamp,
        Foreign Key(user_id) References users(id) on Delete cascade
        )`);
    console.log("Table tasks is created");
    return dbPool;
  } catch (err) {
    console.error("Error creating DB", err);
  }
};

module.exports = initalizedDB;
