This exercise is to develop an API with test driven development.

The test are written in Cypress. I plan on making a video to explain how to write the test code before the api code.

This also shows how to use sequelize to develop a database with foreign key relationships.

The controllers are allowed to interact with the database directly rather than through a data layer. Everything is checked in the controller rather than with a validation middleware to keep this focused on test driven development.

This same exercise is implemented in .Net.

Note: There are tests written to test the api strictly with Vitest and React Testing Library. It was significantly more difficult to set up. I do not recommend it.