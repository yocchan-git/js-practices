#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

dayjs.locale(ja);
const argv = minimist(process.argv.slice(2));

const today = dayjs();
const month = argv["m"] ? String(argv["m"]) : today.format("M");
const year = argv["m"] && argv["y"] ? String(argv["y"]) : today.format("YYYY");

const createSpace = (dayNumber) => {
  return "   ".repeat(dayNumber);
};

const showCalendar = () => {
  const firstDate = dayjs(`${year}-${month}-1`);
  const lastDay = firstDate.endOf("M").format("D");
  const saturday = "6";

  for (let day = 1; day <= lastDay; day++) {
    const currentDate = firstDate.add(day - 1, "d");
    const dayNumber = currentDate.format("d");

    if (day === 1) {
      process.stdout.write(createSpace(dayNumber));
    }
    process.stdout.write(`${currentDate.format("D").padStart(2)} `);

    if (currentDate.format("d") === saturday) {
      console.log("");
    }
  }
};

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

showCalendar();
