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

const yearMonth = `${year}-${month}`;

const createSpace = (dayNumber) => {
  return "   ".repeat(dayNumber);
};

const showCalendar = () => {
  const firstDate = dayjs(yearMonth).startOf("M").format("D");
  const lastDate = dayjs(yearMonth).endOf("M").format("D");
  const saturdayNumber = "6";

  for (let date = firstDate; date <= lastDate; date++) {
    const displayDate = String(date).padStart(2);
    const dayNumber = dayjs(`${year}-${month}-${date}`).format("d");

    if (date === "1") {
      process.stdout.write(createSpace(dayNumber));
    }
    process.stdout.write(`${displayDate} `);

    if (dayNumber === saturdayNumber) {
      console.log("");
    }
  }
};

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

showCalendar();
