#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

dayjs.locale(ja);

const argv = minimist(process.argv.slice(2));
showCalendar();

function showCalendar() {
  const today = dayjs();
  const month = argv["m"] ? String(argv["m"]) : today.format("M");
  const year = argv["m"] && argv["y"] ? String(argv["y"]) : today.format("YYYY");

  console.log(`      ${month}月 ${year}`);
  console.log("日 月 火 水 木 金 土");

  const firstDate = dayjs(`${year}-${month}-1`);
  const lastDay = firstDate.endOf("M").format("D");

  for (let day = 1; day <= lastDay; day++) {
    const currentDate = firstDate.add(day - 1, "d");

    if (day === 1) {
      const dayNumber = currentDate.format("d");
      process.stdout.write("   ".repeat(dayNumber));
    }
    process.stdout.write(`${currentDate.format("D").padStart(2)} `);

    const saturday = "6";
    if (currentDate.format("d") === saturday) {
      console.log("");
    }
  }
};
