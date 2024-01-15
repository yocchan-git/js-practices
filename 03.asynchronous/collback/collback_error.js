#!/usr/bin/env node
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("../books.sqlite3");

// テーブルの作成
db.run(
  `CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
)`,
  function (err) {
    if (err) {
      console.error(err.message);
    }
    let bookTitle = null;
    let insert = `INSERT INTO books (title) VALUES (?)`;

    db.run(insert, [bookTitle], function (err) {
      if (err) {
        console.error(err.message);
      }
      let selectAll = `SELECT title FROM book`;
      db.all(selectAll, function (err) {
        if (err) {
          console.error(err.message);
        }
        let dropTable = `DROP TABLE books`;
        db.run(dropTable, function () {
          console.log("Booksテーブルを削除したよ");
          db.close();
        });
      });
    });
  },
);
console.log("Booksテーブルを作成したよ");
