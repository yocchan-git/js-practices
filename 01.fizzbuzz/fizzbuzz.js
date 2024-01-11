#!/usr/bin/env node

let fizzbuzz = (number) => {
  if (number % 15 == 0) {
    console.log("FizzBuzz");
  } else if (number % 5 == 0) {
    console.log("Buzz");
  } else if (number % 3 == 0) {
    console.log("Fizz");
  } else {
    console.log(number);
  }
};

for (let i = 1; i < 21; i++) {
  fizzbuzz(i);
}
