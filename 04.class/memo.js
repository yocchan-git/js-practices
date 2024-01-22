#!/usr/bin/env node
import minimist from "minimist";
import sqlite3 from "sqlite3";
import readline from "readline";
import Enquirer from "enquirer";

class Memo {
  constructor() {
    this.db = new sqlite3.Database("./memos.sqlite3");
    this.argv = minimist(process.argv.slice(2));
  }

  create() {
    let reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    let memo = "";
    reader.on("line", function (line) {
      memo += line + "\n";
    });

    reader.on("close", () => {
      const sql = `INSERT INTO memos (content) VALUES (?)`;
      this.db.run(sql, [memo], function () {
        console.log(`メモを追加しました`);
      });
    });
  }

  index() {
    this.db.each("SELECT * FROM memos", function (err, memo) {
      const firstLine = memo.content.split("\n")[0];
      console.log(firstLine);
    });
  }

  createIndex() {
    return new Promise((resolve) => {
      let selectAll = `SELECT * FROM memos`;
      this.db.all(selectAll, function (err, memos) {
        resolve(memos);
      });
    });
  }

  change(memos) {
    return new Promise((resolve) => {
      const array = memos.map((memo) => {
        const memoContent = memo.content.split("\n")[0];
        return { id: memo.id, name: memoContent };
      });
      resolve(array);
    });
  }

  show(memoId) {
    this.db.get(
      "SELECT content FROM memos WHERE id = ?",
      memoId,
      function (err, memo) {
        if (err) {
          console.error(err.message);
        }
        console.log(memo.content);
      },
    );
  }

  delete(memoId) {
    const sql = "DELETE FROM memos WHERE id = ?";
    this.db.run(sql, memoId, function () {
      console.log("メモを削除しました");
    });
  }

  async selectMemoId() {
    const memos = await this.createIndex();
    const memosObject = await this.change(memos);

    const question = {
      type: "select",
      name: "id",
      message: "詳細を表示したいメモを選んでください",
      choices: memosObject,
      result() {
        return this.focused.id;
      },
    };
    const answer = await Enquirer.prompt(question);
    return answer.id;
  }

  async actions() {
    await this.createTable();

    if (this.argv["l"]) {
      this.index();
    } else if (this.argv["r"]) {
      const memoId = await this.selectMemoId();
      this.show(memoId);
    } else if (this.argv["d"]) {
      const memoId = await this.selectMemoId();
      this.delete(memoId);
    } else {
      this.create();
    }
  }

  checkTable() {
    return new Promise((resolve) => {
      this.db.get(
        'select count(*) from sqlite_master where type="table" and name=$name',
        { $name: "memos" },
        function (err, table) {
          let exists = false;
          if (0 < table["count(*)"]) {
            exists = true;
          }

          resolve(exists);
        },
      );
    });
  }

  async createTable() {
    const existTable = await this.checkTable();

    if (!existTable) {
      this.db.run(
        "CREATE TABLE memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
      );
    }
  }
}

const memo = new Memo();
memo.actions();
