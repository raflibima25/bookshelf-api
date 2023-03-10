const { nanoid } = require("nanoid");
const books = require("./books");

// POST
const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const id = nanoid(16);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (!isSuccess) {
		const response = h.response({
			status: "error",
			message: "Buku gagal ditambahkan",
		});
		response.code(500);
		return response;
	}

	const response = h.response({
		status: "success",
		message: "Buku berhasil ditambahkan",
		data: {
			bookId: id,
		},
	});
	response.code(201);
	return response;
};

// GET
const getAllBooksHandler = (request, h) => {
	const { reading, name, finished } = request.query;

	let mapedBooks = books;

	if (name !== undefined) {
		mapedBooks = mapedBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
	}

	if (reading !== undefined) {
		mapedBooks = mapedBooks.filter((book) => book.reading === !!Number(reading));
	}

	if (finished !== undefined) {
		mapedBooks = mapedBooks.filter((book) => book.finished === !!Number(finished));
	}

	const response = h.response({
		status: "success",
		data: {
			books: mapedBooks.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);
	return response;
};

// GET BY ID
const getBookByIdHandler = (request, h) => {
	const { id } = request.params;

	const book = books.filter((book) => book.id === id)[0];

	if (book === undefined) {
		const response = h.response({
			status: "fail",
			message: "Buku tidak ditemukan",
		});
		response.code(404);
		return response;
	}

	return {
		status: "success",
		data: {
			book,
		},
	};
};

// PUT
const editBookByIdHandler = (request, h) => {
	const { id } = request.params;

	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
	const updatedAt = new Date().toISOString();

	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const index = books.findIndex((book) => book.id === id);

	const finished = pageCount === readPage;

	if (index !== -1) {
		books[index] = {
			...books[index],
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
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

const deleteBookByIdHandler = (request, h) => {
	const { id } = request.params;

	const index = books.findIndex((book) => book.id === id);

	if (index === -1) {
		const response = h.response({
			status: "fail",
			message: "Buku gagal dihapus. Id tidak ditemukan",
		});
		response.code(404);
		return response;
	}

	books.splice(index, 1);

	const response = h.response({
		status: "success",
		message: "Buku berhasil dihapus",
	});
	response.code(200);
	return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
