#!/usr/bin/env node
import { run, all } from "./async_functions.js";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./books.sqlite3");

// let dropTable = `DROP TABLE books`;
// run(db, dropTable);

async function createBooksWithErrors() {
  await run(
    db,
    `CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )`,
  );
  console.log("Booksテーブルを作成したよ");

  let bookTitle = null;
  let insert = `INSERT INTO books (title) VALUES (?)`;
  try {
    await run(db, insert, [bookTitle]);
  } catch (err) {
    console.error(err);
  }

  let selectAll = `SELECT * FROM book`;
  try {
    let books = await all(db, selectAll);
    console.log(`追加したレコードのID : ${books[0].id}`);
    console.log(`追加した本のタイトル : ${books[0].title}`);
  } catch (err) {
    console.error(err);
  }

  let dropTable = `DROP TABLE books`;
  await run(db, dropTable);

  console.log("Booksテーブルを削除したよ");
  db.close();
}

createBooksWithErrors();
