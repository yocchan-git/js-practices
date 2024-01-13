#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

dayjs.locale(ja);
let argv = minimist(process.argv.slice(2));

let specified_month = dayjs().format("M");
let specified_year = dayjs().format("YYYY");

console.log();
if (argv["m"]) {
  specified_month = String(argv["m"]);
  if (argv["y"]) {
    specified_year = String(argv["y"]);
  }
}

console.log(specified_month);
console.log(specified_year);

const midasi = `      ${specified_month}月 ${specified_year}     \n日 月 火 水 木 金 土\n`;

process.stdout.write(midasi);

const create_space = (wday_number) => {
  return "   ".repeat(wday_number);
};

const show_calendar = () => {
  let first_date = dayjs(`${specified_year}-${specified_month}-1`)
    .startOf("M")
    .format("D");
  let last_date = dayjs(`${specified_year}-${specified_month}-1`)
    .endOf("M")
    .format("D");

  for (let i = first_date; i <= last_date; i++) {
    let display_date = String(i);

    if (i === "1") {
      process.stdout.write(
        `${create_space(
          dayjs(`${specified_year}-${specified_month}-1`).format("d"),
        )} 1 `,
      );
    } else {
      process.stdout.write(`${display_date.padStart(2)} `);
    }

    if (
      dayjs(`${specified_year}-${specified_month}-${i}`).format("d") === "6"
    ) {
      console.log(" ");
    }
  }
};

show_calendar();
