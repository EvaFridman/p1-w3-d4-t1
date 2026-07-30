const { Book } = require('./database/models');

async function createBook(data) {
    try {
        const newBook = await Book.create(data);
        return newBook.get();
    } catch (error) {
        console.error('Ошибка при создании книги:', error.message);
    }
}

async function getAllBooks() {
    try {
        const books = await Book.findAll();
        return books.map(book => book.get());
    } catch (error) {
        console.error('Ошибка при получении всех книг:', error.message);
    }
}

async function getBookById(id) {
    try {
        const book = await Book.findByPk(id);
        return book ? book.get() : null;
    } catch (error) {
        console.error(`Ошибка при получении книги с id ${id}:`, error.message);
    }
}

async function updateBookPrice(id, price) {
    try {
        await Book.update({ price: price }, { where: { id: id } });
        const updatedBook = await Book.findByPk(id);
        return updatedBook ? updatedBook.get() : null;
    } catch (error) {
        console.error(`Ошибка при обновлении цены для id ${id}:`, error.message);
    }
}

async function deleteBook(id) {
    try {
        const deletedCount = await Book.destroy({ where: { id: id } });
        return deletedCount;
    } catch (error) {
        console.error(`Ошибка при удалении книги с id ${id}:`, error.message);
    }
}

async function main() {
    const seed = [
        { title: 'Чистый код', author: 'Роберт Мартин', genre: 'tech', pages: 464, price: 2900.00 },
        { title: 'Дюна', author: 'Фрэнк Герберт', genre: 'sci-fi', pages: 688, price: 1200.00 },
        { title: 'Гарри Поттер', author: 'Джоан Роулинг', genre: 'fantasy', pages: 432, price: 990.00 },
    ];

    console.log('Создаем книги:');
    for (const bookData of seed) {
        const created = await createBook(bookData);
        console.log('Создана книга:', created);
    }

    console.log('\nПолучаем список всех книг:');
    const allBooks = await getAllBooks();
    console.log(allBooks);

    console.log('\nИщем книгу по ID:');
    const book = await getBookById(1);
    console.log('Найдена книга:', book);

    console.log('\nОбновляем цену книги с ID 1:');
    const newPrice = 3500.00;
    const updatedBook = await updateBookPrice(1, newPrice);
    console.log('Обновленная книга:', updatedBook);

    console.log('\nУдаляем книгу с ID 1:');
    await deleteBook(1);
    const checkDeleted = await getBookById(1);
    console.log(`Книга ${checkDeleted ? 'не удалена' : 'удалена'}`);
}

main();