import db from "./config/database.config";
import app from "./app";

require("dotenv").config();

db.sync().then(() => {
  console.log("Connected to db");
});

// Turn on once then comment out when database is seeded
// db.queryInterface.bulkInsert("product", [
//   {
//     id: 1,
//     name: "Dog Food",
//     description: "Your dog will love our beef and rice flavored dry dog food.",
//     price: 9.99,
//   },
//   {
//     id: 2,
//     name: "Cat Food",
//     description:
//       "Your cat will passively enjoy our salmon flavored wet cat food.",
//     price: 12.99,
//   },
//   {
//     id: 3,
//     name: "Lizard Food",
//     description: "Your lizard likes to eat bugs. So this is made of bugs.",
//     price: 3.99,
//   },
// ]);

const port = 8000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
