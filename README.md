# p1-w3-d4-t1
# Задача 1 — первая база на Sequelize и CRUD функциями

Всю неделю писала SQL руками. Теперь — ORM: работаешь с базой через объекты кода, а SQL Sequelize генерирует сам. Поднимаешь проект, одну модель, миграцию — и покрываешь её CRUD-операциями обычными асинхронными функциями на чистом JS, без Express. Домен — каталог книг.

## Подготовка проекта

1. `mkdir sequelize-books && cd sequelize-books && git init`
2. `echo "lts/*" > .nvmrc && nvm use`
3. `npm init -y`
4. библиотека и драйвер: `npm install sequelize pg pg-hstore`
5. CLI только для разработки: `npm install --save-dev sequelize-cli`
6. создай в корне `.sequelizerc` — он сложит всё про базу в папку `database/`:

```js
const path = require('path');
module.exports = {
  config: path.resolve('database', 'config', 'config.json'),
  'models-path': path.resolve('database', 'models'),
  'migrations-path': path.resolve('database', 'migrations'),
  'seeders-path': path.resolve('database', 'seeders'),
};
```

7. `npx sequelize-cli init` — создаст `database/config/config.json`, `models/`, `migrations/`, `seeders/`
8. в `database/config/config.json` впиши своё подключение в блок `development` (`username`, `password`, `database: 'books_db'`, `host: 127.0.0.1`, `port: 5432`, `dialect: 'postgres'`)
9. `.gitignore`: `node_modules`, `*.log`, и обязательно `database/config/config.json` — там пароль от базы, в репозиторий он не идёт
10. создай саму базу в `psql`: `CREATE DATABASE books_db;`

## Модель и миграция

Одной командой сгенерируй модель и миграцию:

```
npx sequelize-cli model:generate --name Book --attributes title:string,author:string,genre:string,pages:integer,price:decimal
```

Открой файл модели и доведи поля до нужных ограничений (это те же `NOT NULL`, `UNIQUE`, `DEFAULT` из понедельника, только в модели):

- `title` — строка, обязательная (`allowNull: false`);
- `author` — строка, обязательная;
- `genre` — строка;
- `pages` — целое;
- `price` — `DECIMAL(10, 2)`;
- добавь `inStock` — `BOOLEAN` с `defaultValue: true`.

`id`, `createdAt`, `updatedAt` Sequelize добавит сам. Если правишь набор полей — поправь и файл миграции, чтобы структура таблицы совпадала с моделью. Примени: `npx sequelize-cli db:migrate`.

## CRUD функциями

В файле `crud.js` подключи модели (`const { Book } = require('./database/models')`) и напиши асинхронные функции, каждая делает одну операцию через методы модели, а не через SQL:

- `createBook(data)` — `Book.create(...)`, вернуть созданную книгу;
- `getAllBooks()` — `Book.findAll()`;
- `getBookById(id)` — `Book.findByPk(id)`;
- `updateBookPrice(id, price)` — `Book.update(...)` по условию, затем вернуть обновлённую;
- `deleteBook(id)` — `Book.destroy(...)`.

Внизу — асинхронная `main()`, которая по очереди вызывает функции и печатает результат в консоль, и запуск `main()`. Файл запускается через `node crud.js`.

## Входные данные

Книги для проверки — создай их через `createBook`:

```js
const seed = [
  { title: 'Чистый код',    author: 'Роберт Мартин',    genre: 'tech',    pages: 464, price: 2900.00 },
  { title: 'Дюна',          author: 'Фрэнк Герберт',     genre: 'sci-fi',  pages: 688, price: 1200.00 },
  { title: 'Гарри Поттер',  author: 'Джоан Роулинг',     genre: 'fantasy', pages: 432, price: 990.00 },
];
```

## Ожидаемый результат

`db:migrate` создаёт таблицу `Books` с полями из модели плюс автоматические `id`, `createdAt`, `updatedAt` — это видно в DBeaver. Запуск `node crud.js` отрабатывает без ошибок: `createBook` вставляет книгу и возвращает её уже с присвоенным базой `id`; `getAllBooks` возвращает массив всех книг; `getBookById` — одну книгу или `null`, если id нет; `updateBookPrice` меняет цену конкретной книги, и следующий вызов это подтверждает; `deleteBook` убирает книгу, после чего `getAllBooks` возвращает на одну меньше. Ни одной строки сырого SQL в `crud.js` нет — только методы модели. Поле `inStock` у новых книг по умолчанию `true`, потому что так задано в модели.