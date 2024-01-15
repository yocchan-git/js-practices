#!/usr/bin/env node
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./books.sqlite3");

// テーブルの作成
db.run(
  `CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
)`,
  function () {
    let bookTitle = "ふりがなJavaScript";
    let insert = `INSERT INTO books (title) VALUES (?)`;
    db.run(insert, [bookTitle], function () {
      let selectAll = `SELECT title FROM books`;
      db.all(selectAll, function (err, rows) {
        let dropTable = `DROP TABLE books`;
        db.run(dropTable, function () {
          console.log("Booksテーブルを削除したよ");
          db.close();
        });
        console.log(`追加した本のタイトル : ${rows[0].title}`);
      });
      console.log(`追加したレコードのID : ${this.lastID}`);
    });
  },
);
console.log("Booksテーブルを作成したよ");
