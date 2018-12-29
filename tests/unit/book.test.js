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
   // expect(res.body).toHaveProperty("data.publishYear");
   // expect(res.body).toHaveProperty("data.pagesNumber");
   // expect(res.body).toHaveProperty("data.image");
   // expect(res.body).toHaveProperty("data.category");
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
  var title, isbn,category;

  const exec = async () => {
    return await request(server)
      .post("/api/book/create")
      .send({ title,isbn });
  };

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

    const res = await request(server).post("/api/book/create").send({ title,isbn,category });

    expect(res.status).toBe(400);
  });

  it("should return 400 if book's author is not available in file", async () => {
    //Just for increasing branch coverage in book.js
    title = "test book";
    isbn = "1PZF17IST7CO81RIJV0YH4PSVGGOUSG2OO";
    author = "ddc81706-b0c9-4ec6-a3ce-78a2300d442d";

    const res = await request(server).post("/api/book/create").send({ title,isbn,author });

    expect(res.status).toBe(400);
  });

  it("should return the book if it is created successfully", async () => {
    title = "test book";
    isbn = "3A3RLG23HNSGQ2QGJ0GEU0A5V70DODPU";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.title", "test book");
    expect(res.body).toHaveProperty("data.isbn", "3A3RLG23HNSGQ2QGJ0GEU0A5V70DODPU");

  });
}); 

describe("POST /api/book", () => {  
    it("should return 200 if all books are retrieved", async () => {
      var res = await request(server).post('/api/book/');
      var message = "Books loaded successfully";
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", message);
    });
  });