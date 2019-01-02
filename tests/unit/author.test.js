const uuidv4 = require("uuid/v4");
const request = require("supertest");
const server = require("../../app");
const author = require("../../api/models/author");
const _ = require("lodash");

describe("GET /api/author/:id", () => {
  afterAll(async () => {
    await server.close();
  });

  it("should return author if valid id is passed", async () => {
    // existing id in the file
    const id = "1fb64057-cffc-46e6-a347-4bb5631f0e83";
    await author.readAuthorById(id);

    const res = await request(server).get("/api/author/" + id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data.name");
    expect(res.body).toHaveProperty("data.jobTitle");
    expect(res.body).toHaveProperty("data.bio");
  });

  it("should return 404 if invalid id is passed", async () => {
    const res = await request(server).get("/api/author/1");

    expect(res.status).toBe(404);
  });
});

describe("POST /api/author/create", () => {
  // beforeAll(async () => {
  //   await server.close();
  // });

  //variables
  var name, jobTitle;

  const exec = async () => {
    return await request(server)
      .post("/api/author/create")
      .send({ name, jobTitle });
  };

  it("should return 500", async () => {
    name = 123;
    jobTitle = "architect";
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if author's name is empty", async () => {
    name = "       ";
    jobTitle = "software testing engineer";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if author's job title is empty", async () => {
    name = "Steve Jobs";
    jobTitle = "     ";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  //TO BE REVIEWED
  // it("should not create the author if its name already exists", async () => {
  //   name = "Alena Graham";
  //   jobTitle = "poet";
  //   var message = "Author with the same name already exists";
  //   const res = await exec();

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("data.message", message);
  // });

  it("should return the author if it is created successfully", async () => {
    name = "Sylvia Plath";
    jobTitle = "poet";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.name", "Sylvia Plath");
    expect(res.body).toHaveProperty("data.jobTitle", "poet");
  });
});

describe("PUT /api/update/author/:id", () => {
  var newName, newJobTitle;
  var id;

  const exec = async () => {
    return await request(server)
      .put("/api/update/author/" + id)
      .send({ name: newName, jobTitle: newJobTitle });
  };

  it("should return 500", async () => {
    id = "1fb64057-cffc-46e6-a347-4bb5631f0e83";
    newName = 123;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if author's name is empty", async () => {
    id = "1fb64057-cffc-46e6-a347-4bb5631f0e83";
    newName = "            ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if author with the given id was not found", async () => {
    id = uuidv4();
    newName = "updated name";
    newJobTitle = "updated job title";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return the updated author if it is a valid update ", async () => {
    id = "1fb64057-cffc-46e6-a347-4bb5631f0e83"; //existing id in the file
    newName = "updated name";
    newJobTitle = "updated job title";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.bio");
    expect(res.body).toHaveProperty("data.name", newName);
    expect(res.body).toHaveProperty("data.jobTitle", newJobTitle);
  });

  it("should return the updated author if it is a valid update, only job title", async () => {
    id = "1fb64057-cffc-46e6-a347-4bb5631f0e83"; //existing id in the file
    newJobTitle = "updated job title";

    const res = await request(server)
      .put("/api/update/author/" + id)
      .send({ jobTitle: newJobTitle });

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.bio");
    expect(res.body).toHaveProperty("data.jobTitle", newJobTitle);
  });

  it("should return the updated author if it is a valid update, only name", async () => {
    id = "1fb64057-cffc-46e6-a347-4bb5631f0e83"; //existing id in the file
    newName = "updated name";

    const res = await request(server)
      .put("/api/update/author/" + id)
      .send({ name: newName });

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.bio");
    expect(res.body).toHaveProperty("data.name", newName);
  });
});

describe("DELETE /api/delete/author/:id", () => {
  var id;
  const exec = async () => {
    return await request(server)
      .delete("/api/delete/author/" + id)
      .send();
  };

  it("should return 404 if no author with the given id was found", async () => {
    id = uuidv4();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should abort deleting an author if he/she has books written by them", async () => {
    id = "62297f74-09bb-43cc-a321-43c4f49c2894";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "data",
      "Cannot delete an author, without deleting his/her books first"
    );
  });

  it("should return the removed author", async () => {
    id = "742bb994-d9f0-47bf-808d-dae904be24a4";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id", id);
    expect(res.body).toHaveProperty("data.name", "Zaha");
    expect(res.body).toHaveProperty("data.jobTitle", "architect");
  });
});

describe("POST /api/author", () => {
  var page, size, sortBy;

  afterAll(async () => {
    await server.close();
  });

  it("should return 200 if all authors are retrieved", async () => {
    var res = await request(server).post("/api/author/");
    var message = "Authors loaded successfully";

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", message);
  });

  it("should return last 3 records in file if page number exceeded records in file", async () => {
    page = 100;
    size = 3;
    var res = await request(server)
      .post("/api/author/")
      .send({ page, size });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[1]).toHaveProperty("jobTitle", "updated job title");
  });
});
