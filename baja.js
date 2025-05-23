const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("vida.db");

db.serialize(() => {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
    (err, tables) => {
      if (err) {
        console.error("Error fetching tables:", err);
        db.close();
        return;
      }
      tables.forEach((table) => {
        const tableName = table.name;
        db.run(`DELETE FROM "${tableName}"`, (err) => {
          if (err) {
            console.error(`Error deleting data from ${tableName}:`, err);
          } else {
            console.log(`All data deleted from ${tableName}`);
          }
        });
      });
    }
  );
});

db.close();
