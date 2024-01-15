#!/usr/bin/env node
import { run, all } from "./promise_functions.js";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./books.sqlite3");

// テーブルの作成
run(
  db,
  `CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
)`,
)
  .then(function () {
    let bookTitle = "ふりがなJavaScript";
    let insert = `INSERT INTO books (title) VALUES (?)`;
    // レコードを追加する
    return run(db, insert, [bookTitle]);
  })
  .then(function () {
    let selectAll = `SELECT * FROM books`;
    // レコードを取得する
    return all(db, selectAll);
  })
  .then(function (rows) {
    console.log(`追加したレコードのID : ${rows[0].id}`);
    console.log(`追加した本のタイトル : ${rows[0].title}`);
    // テーブルを削除する
    let dropTable = `DROP TABLE books`;
    return run(db, dropTable);
  })
  .then(function () {
    console.log("Booksテーブルを削除したよ");
    db.close();
  });
console.log("Booksテーブルを作成したよ");
