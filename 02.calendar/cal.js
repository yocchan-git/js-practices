#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

dayjs.locale(ja);
const argv = minimist(process.argv.slice(2));

let month = dayjs().format("M");
let year = dayjs().format("YYYY");

if (argv["m"]) {
  month = String(argv["m"]);
  if (argv["y"]) {
    year = String(argv["y"]);
  }
}

const formatted_month_and_year = `${year}-${month}`;

const create_space = (week_number) => {
  return "   ".repeat(week_number);
};

const show_calendar = () => {
  const first_date = dayjs(formatted_month_and_year).startOf("M").format("D");
  const last_date = dayjs(formatted_month_and_year).endOf("M").format("D");

  for (let date = first_date; date <= last_date; date++) {
    const display_date = String(date).padStart(2);
    const date_week_number = dayjs(`${year}-${month}-${date}`).format("d");

    if (date === "1") {
      process.stdout.write(`${create_space(date_week_number)} 1 `);
    } else {
      process.stdout.write(`${display_date} `);
    }

    if (date_week_number === "6") {
      console.log("");
    }
  }
};

const month_and_year = `      ${month}月 ${year}     \n日 月 火 水 木 金 土\n`;
process.stdout.write(month_and_year);

show_calendar();
