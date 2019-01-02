const uuidv4 = require("uuid/v4");
const request = require("supertest");
const server = require("../../app");
const book = require("../../api/models/book");
const _ = require("lodash");

describe("GET /api/book/:id", () => {
  afterAll(async () => {
    await server.close();
  });

  it("should return book if valid id is passed", async () => {
    const id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    await book.readBookById(id);

    const res = await request(server).get("/api/book/" + id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data.title");
    expect(res.body).toHaveProperty("data.author");
    expect(res.body).toHaveProperty("data.description");
    expect(res.body).toHaveProperty("data.isbn");
    expect(res.body).toHaveProperty("data.publishYear");
    expect(res.body).toHaveProperty("data.pagesNumber");
    expect(res.body).toHaveProperty("data.image");
    expect(res.body).toHaveProperty("data.category");
  });

  it("should return 404 if invalid id is passed", async () => {
    const res = await request(server).get("/api/book/1");

    expect(res.status).toBe(404);
  });
});

describe("POST /api/book/create", () => {
  afterAll(async () => {
    return await server.close();
  });

  //variables
  var title, isbn, category;

  const exec = async () => {
    return await request(server)
      .post("/api/book/create")
      .send({ title, isbn });
  };

  it("should return 500", async () => {
    title = "test book";
    isbn = 500;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if book's title is empty", async () => {
    title = "       ";
    isbn = "1PZF17IST7CO81RIJV0YH4PSVGGOUSG2OO";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if book's category is not available in file", async () => {
    //Just for increasing branch coverage in book.js
    title = "test book";
    isbn = "1PZF17IST7CO81RIJV0YH4PSVGGOUSG2OO";
    category = "0313199d-f68f-45bb-a60d-80e407bae784";

    const res = await request(server)
      .post("/api/book/create")
      .send({ title, isbn, category });

    expect(res.status).toBe(400);
  });

  it("should return 400 if book's author is not available in file", async () => {
    //Just for increasing branch coverage in book.js
    title = "test book";
    isbn = "1PZF17IST7CO81RIJV0YH4PSVGGOUSG2OO";
    author = "ddc81706-b0c9-4ec6-a3ce-78a2300d442d";

    const res = await request(server)
      .post("/api/book/create")
      .send({ title, isbn, author });

    expect(res.status).toBe(400);
  });

  it("should return the book if it is created successfully", async () => {
    title = "test title";
    isbn = "3A3RLG23HNSGQ2QGJ0GEU0A5vwjovjmwepvjqmevjwqkvjiqpV70DODPU";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.title", "test title");
    expect(res.body).toHaveProperty(
      "data.isbn",
      "3A3RLG23HNSGQ2QGJ0GEU0A5vwjovjmwepvjqmevjwqkvjiqpV70DODPU"
    );
  });
});

describe("PUT /api/update/book/:id", () => {
  var newTitle, newIsbn;
  var id;

  const exec = async () => {
    return await request(server)
      .put("/api/update/book/" + id)
      .send({ title: newTitle, isbn: newIsbn });
  };

  it("should return 500", async () => {
    id = "a7ff7cd8-7f45-42fe-ac3b-ed8d275e91be";
    newIsbn = 500;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if book's title is empty", async () => {
    id = "a7ff7cd8-7f45-42fe-ac3b-ed8d275e91be";
    newTitle = "            ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if book with the given id was not found", async () => {
    id = uuidv4();
    newTitle = "updated title";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return the updated book if it is a valid update ", async () => {
    id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    newTitle = "updated title";
    newIsbn = "hngvberuigvbrgrehogveogvwohgvweohgvhwefvioweogv";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.isbn");
    expect(res.body).toHaveProperty("data.title", newTitle);
    expect(res.body).toHaveProperty("data.isbn", newIsbn);
  });

  it("should return 400 if book's category is not available in file", async () => {
    //Just for increasing branch coverage
    id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    newTitle = "updated title";
    newCategory = "0313199d-f68f-45bb-a60d-80e407bae784";

    const res = await request(server)
      .put("/api/update/book/" + id)
      .send({ title: newTitle, category: newCategory });

    expect(res.status).toBe(400);
  });

  it("should return 400 if book's author is not available in file", async () => {
    //Just for increasing branch coverage
    id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    newTitle = "updated title";
    newAuthor = "ddc81706-b0c9-4ec6-a3ce-78a2300d442d";

    const res = await request(server)
      .put("/api/update/book/" + id)
      .send({ title: newTitle, author: newAuthor });

    expect(res.status).toBe(400);
  });

  it("should return the updated book if it is a valid update, only title", async () => {
    id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    newTitle = "updated title";

    const res = await request(server)
      .put("/api/update/book/" + id)
      .send({ title: newTitle });

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.isbn");
    expect(res.body).toHaveProperty("data.title", newTitle);
  });

  it("should return the updated book if it is a valid update, only isbn", async () => {
    id = "ceb1138c-a247-43b5-8470-edcff6783bab";
    newIsbn = "jigvjiweogvbregrhethbjiortbhjrbhjerjgbir";

    const res = await request(server)
      .put("/api/update/book/" + id)
      .send({ isbn: newIsbn });

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.isbn", newIsbn);
    expect(res.body).toHaveProperty("data.title");
  });
});

describe("DELETE /api/delete/book/:id", () => {
  var id;
  const exec = async () => {
    return await request(server)
      .delete("/api/delete/book/" + id)
      .send();
  };

  it("should return 404 if no book with the given id was found", async () => {
    id = uuidv4();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return the removed book", async () => {
    id = "a7ff7cd8-7f45-42fe-ac3b-ed8d275e91be";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id", id);
    expect(res.body).toHaveProperty("data.title", "The Hunger Games");
    expect(res.body).toHaveProperty("data.description", "Fire is catching");
  });
});

describe("POST /api/book", () => {
  var page, size, filterBy, sortBy;

  it("should return 500", async () => {
    sortBy = 123;
    page = 2;
    size = 15;
    var res = await request(server)
      .post("/api/book/")
      .send({ page, size, sortBy });

    expect(res.status).toBe(500);
  });

  it("should return 200 if all books are retrieved", async () => {
    var res = await request(server).post("/api/book/");
    var message = "Books loaded successfully";

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", message);
  });

  it("should return records in file wrt filter specified", async () => {
    page = 1;
    size = 15;
    filterBy = { author: "8dec0840-5ab5-4e07-8452-a0c787fa8805" };
    var res = await request(server)
      .post("/api/book/")
      .send({ page, size, filterBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty(
      "author",
      "8dec0840-5ab5-4e07-8452-a0c787fa8805"
    );
    expect(res.body.data[1]).toHaveProperty(
      "author",
      "8dec0840-5ab5-4e07-8452-a0c787fa8805"
    );
  });

  it("should return first 3 records in file if page number is -ve", async () => {
    page = -100;
    size = 3;
    var res = await request(server)
      .post("/api/book/")
      .send({ page, size });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });

  it("should return records in file wrt filter if page number is -ve", async () => {
    page = -100;
    size = 15;
    filterBy = { author: "8dec0840-5ab5-4e07-8452-a0c787fa8805" };
    var res = await request(server)
      .post("/api/book/")
      .send({ page, size, filterBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty(
      "author",
      "8dec0840-5ab5-4e07-8452-a0c787fa8805"
    );
    expect(res.body.data[1]).toHaveProperty(
      "author",
      "8dec0840-5ab5-4e07-8452-a0c787fa8805"
    );
  });

  it("should return records in file wrt filter if page number exceeded records in file", async () => {
    page = 500;
    filterBy = { publishYear: 2002 };
    var res = await request(server)
      .post("/api/book/")
      .send({ page, filterBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toHaveProperty("publishYear", 2002);
  });

  it("should return all books in file whose publish year is 2002", async () => {
    filterBy = { publishYear: 2002 };
    var res = await request(server)
      .post("/api/book/")
      .send({ filterBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0]).toHaveProperty("publishYear", 2002);
    expect(res.body.data[1]).toHaveProperty("publishYear", 2002);
    expect(res.body.data[2]).toHaveProperty("publishYear", 2002);
  });

  it("should return all books in file whose publish year is 2002, sorted", async () => {
    //just for branch coverage
    filterBy = { publishYear: 2002 };
    sortBy = "title";
    var res = await request(server)
      .post("/api/book/")
      .send({ filterBy, sortBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0]).toHaveProperty("publishYear", 2002);
    expect(res.body.data[1]).toHaveProperty("publishYear", 2002);
    expect(res.body.data[2]).toHaveProperty("publishYear", 2002);
  });
});
