#!/usr/bin/env node
import { run, all } from "./promise_functions.js";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("../books.sqlite3");

run(
  db,
  `CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
)`,
)
  .then(function () {
    const bookTitle = "ふりがなJavaScript";
    const insert = `INSERT INTO books (title) VALUES (?)`;

    return run(db, insert, [bookTitle]);
  })
  .then(function () {
    const selectAll = `SELECT * FROM books ORDER BY id ASC`;

    return all(db, selectAll);
  })
  .then(function (rows) {
    console.log(`追加したレコードのID : ${rows[0].id}`);
    console.log(`追加した本のタイトル : ${rows[0].title}`);

    const dropTable = `DROP TABLE books`;
    return run(db, dropTable);
  })
  .then(function () {
    console.log("Booksテーブルを削除したよ");
    db.close();
  });
console.log("Booksテーブルを作成したよ");
