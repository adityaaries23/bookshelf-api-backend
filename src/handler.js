const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  // const reading = readPage < pageCount;

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  const book = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(book);

  const isSuccess = bookshelf.filter((b) => b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'buku gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const books = [];

  if (name !== undefined) {
    bookshelf.filter((b) => !b.reading).forEach((d) => {
      const book = {
        id: d.id,
        name: d.name,
        publisher: d.publisher,
      };
      books.push(book);
    });
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    const status = reading === '0';
    if (status) {
      bookshelf.filter((b) => !b.reading).forEach((d) => {
        const book = {
          id: d.id,
          name: d.name,
          publisher: d.publisher,
        };
        books.push(book);
      });
    } else {
      bookshelf.filter((b) => b.reading).forEach((d) => {
        const book = {
          id: d.id,
          name: d.name,
          publisher: d.publisher,
        };
        books.push(book);
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const status = finished === '0';
    if (status) {
      bookshelf.filter((b) => !b.finished).forEach((d) => {
        const book = {
          id: d.id,
          name: d.name,
          publisher: d.publisher,
        };
        books.push(book);
      });
    } else {
      bookshelf.filter((b) => b.finished).forEach((d) => {
        const book = {
          id: d.id,
          name: d.name,
          publisher: d.publisher,
        };
        books.push(book);
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }
  bookshelf.forEach((d) => {
    const book = {
      id: d.id,
      name: d.name,
      publisher: d.publisher,
    };
    books.push(book);
  });

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookHandler = (request, h) => {
  const { id } = request.params;

  const book = bookshelf.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  // const reading = readPage < pageCount;

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  const index = bookshelf.findIndex((n) => n.id === id);

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;

  const index = bookshelf.findIndex((n) => n.id === id);
  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookHandler, editBookHandler, deleteBookHandler,
};
