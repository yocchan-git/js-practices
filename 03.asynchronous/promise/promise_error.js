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
    const bookTitle = null;
    const insert = `INSERT INTO books (title) VALUES (?)`;

    return run(db, insert, [bookTitle]);
  })
  .catch(function (err) {
    console.error(err);
  })
  .then(function () {
    const selectAll = `SELECT * FROM book ORDER BY id ASC`;
    return all(db, selectAll);
  })
  .catch(function (err) {
    console.error(err);
  })
  .then(function () {
    const dropTable = `DROP TABLE books`;
    return run(db, dropTable);
  })
  .then(function () {
    console.log("Booksテーブルを削除したよ");
    db.close();
  });
console.log("Booksテーブルを作成したよ");
