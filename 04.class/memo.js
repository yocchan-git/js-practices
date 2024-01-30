import minimist from "minimist";
import sqlite3 from "sqlite3";
import readline from "readline";
import Enquirer from "enquirer";

export default class Memo {
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

  fetchAllMemos() {
    return new Promise((resolve) => {
      let selectAll = `SELECT * FROM memos`;
      this.db.all(selectAll, function (err, memos) {
        resolve(memos);
      });
    });
  }

  changeMemoFormatForEnquirer(memos) {
    const formattedMemos = memos.map((memo) => {
      const memoContent = memo.content.split("\n")[0];
      return { id: memo.id, name: memoContent };
    });
    return formattedMemos
  }

  delete(memoId) {
    const sql = "DELETE FROM memos WHERE id = ?";
    this.db.run(sql, memoId, function () {
      console.log("メモを削除しました");
    });
  }

  async selectMemoId() {
    const memos = await this.fetchAllMemos();
    const memosObject = this.changeMemoFormatForEnquirer(memos);

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

    const selectedMemo = memos.find(memo => memo.id === answer.id);
    return selectedMemo;
  }

  async run_memo() {
    await this.createTable();

    if (this.argv["l"]) {
      this.index();
    } else if (this.argv["r"]) {
      const memo = await this.selectMemoId();
      console.log(memo.content)
    } else if (this.argv["d"]) {
      const memo = await this.selectMemoId();
      this.delete(memo.id);
    } else {
      this.create();
    }
  }

  createTable() {
    return new Promise((resolve) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
        () => {
          resolve();
        }
      );
    });
  }
}
