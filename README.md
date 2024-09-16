Test driven api development article about this repo: https://dev.to/papasanto/test-driven-api-development-with-cypress-3l6d

Video Demonstration Series: https://www.youtube.com/watch?v=5q_H3nk3KBg&list=PL_kocBMOO_TyAK751c6wtbGrrE2mHoHl3

This exercise is to develop an API with test driven development. The test are written in Cypress. This also shows how to use sequelize to develop a database with foreign key relationships.

The controllers are allowed to interact with the database directly rather than through a data layer. Everything is checked in the controller rather than with a validation middleware to keep this focused on test driven development.

This same exercise is implemented in .Net with Entity Framework:
https://github.com/Papa-Santo/Test-Driven-Api-Development-.Net

Note: There are tests written to test the api strictly with Vitest and React Testing Library. It was significantly more difficult to set up. I do not recommend it.
