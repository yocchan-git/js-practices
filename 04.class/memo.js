import minimist from "minimist";
import sqlite3 from "sqlite3";
import readline from "readline";
import Enquirer from "enquirer";

export default class Memo {
  constructor() {
    this.db = new sqlite3.Database("./memos.sqlite3");
    this.argv = minimist(process.argv.slice(2));
  }

  async run_memo_app() {
    await this.createTable();

    if (this.argv["l"]) {
      this.index();
    } else if (this.argv["r"]) {
      const memo = await this.selectMemo();
      console.log(memo.content);
    } else if (this.argv["d"]) {
      const memo = await this.selectMemo();
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
        },
      );
    });
  }

  index() {
    this.db.each("SELECT * FROM memos", (err, memo) => {
      const firstLine = memo.content.split("\n")[0];
      console.log(firstLine);
    });
  }

  async selectMemo() {
    const memos = await this.fetchAllMemos();
    const formattedMemos = this.changeMemoFormatForEnquirer(memos);

    const question = {
      type: "select",
      name: "id",
      message: "詳細を表示したいメモを選んでください",
      choices: formattedMemos,
      result() {
        return this.focused.id;
      },
    };
    const answer = await Enquirer.prompt(question);

    const selectedMemo = memos.find((memo) => memo.id === answer.id);
    return selectedMemo;
  }

  fetchAllMemos() {
    return new Promise((resolve) => {
      let selectAll = `SELECT * FROM memos`;
      this.db.all(selectAll, (err, memos) => {
        resolve(memos);
      });
    });
  }

  changeMemoFormatForEnquirer(memos) {
    const formattedMemos = memos.map((memo) => {
      const memoContent = memo.content.split("\n")[0];
      return { id: memo.id, name: memoContent };
    });
    return formattedMemos;
  }

  delete(memoId) {
    const sql = "DELETE FROM memos WHERE id = ?";
    this.db.run(sql, memoId, () => {
      console.log("メモを削除しました");
    });
  }

  create() {
    let reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    let memo = "";
    reader.on("line", (line) => {
      memo += line + "\n";
    });

    reader.on("close", () => {
      const sql = `INSERT INTO memos (content) VALUES (?)`;
      this.db.run(sql, [memo], () => {
        console.log(`メモを追加しました`);
      });
    });
  }
}
