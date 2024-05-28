## Project MJV - Back End

=> Criar Migration: npx sequelize-cli db:migrate --name name_migration
=> Migrar Migration: npx sequelize-cli db:migrate
=> Desfazer Migration (a última): npx sequelize-cli db:migrate:undo
=> Desfazer Migration (especifica): npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
=> Desfazer Todas Migrations: npx sequelize-cli db:migrate:undo:all

=> Criar Seed: npx sequelize-cli seed:generate --name name_seed
=> Migrar Seed: npx sequelize-cli db:seed:all
=> Desfazer Seed (a última): npx sequelize-cli db:seed:undo
=> Desfazer Seed (especifica): npx sequelize-cli db:seed:undo --seed name_seed
=> Desfazer todas as seed: npx sequelize-cli db:seed:undo:all

