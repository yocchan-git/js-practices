export function run(database, query, params = []) {
  return new Promise((resolve, reject) => {
    database.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function all(database, query, params = []) {
  return new Promise((resolve, reject) => {
    database.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
