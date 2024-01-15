#!/usr/bin/env node
import { run, all } from "./async_functions.js";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./books.sqlite3");

async function createBooksNonErrors() {
  await run(
    db,
    `CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )`,
  );
  console.log("Booksテーブルを作成したよ");

  let bookTitle = "ふりがなJavaScript";
  let insert = `INSERT INTO books (title) VALUES (?)`;
  await run(db, insert, [bookTitle]);

  let selectAll = `SELECT * FROM books`;
  let books = await all(db, selectAll);
  console.log(`追加したレコードのID : ${books[0].id}`);
  console.log(`追加した本のタイトル : ${books[0].title}`);

  let dropTable = `DROP TABLE books`;
  await run(db, dropTable);

  console.log("Booksテーブルを削除したよ");
  db.close();
}

createBooksNonErrors();
