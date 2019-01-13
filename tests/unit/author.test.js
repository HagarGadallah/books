const uuidv1 = require("uuid/v1");
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
    const id = "c9415976-170a-11e9-ab14-d663bd873d93";
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

  it("should not create the author if its name and job title already exist", async () => {
    name = "Noe Veum";
    jobTitle = "Senior Optimization Facilitator";
    var message = "Author already exists";
    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", message);
  });

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
    id = "9a0be2f8-1709-11e9-ab14-d663bd873d93";
    newName = 123;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if author's name is empty", async () => {
    id = "9a0be2f8-1709-11e9-ab14-d663bd873d93";
    newName = "            ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if author with the given id was not found", async () => {
    id = uuidv1();
    newName = "updated name";
    newJobTitle = "updated job title";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return the updated author if it is a valid update ", async () => {
    id = "9a0be2f8-1709-11e9-ab14-d663bd873d93"; //existing id in the file
    newName = "updated name";
    newJobTitle = "updated job title";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.bio");
    expect(res.body).toHaveProperty("data.name", newName);
    expect(res.body).toHaveProperty("data.jobTitle", newJobTitle);
  });

  it("should return the updated author if it is a valid update, only job title", async () => {
    id = "9a0be2f8-1709-11e9-ab14-d663bd873d93"; //existing id in the file
    newJobTitle = "updated job title";

    const res = await request(server)
      .put("/api/update/author/" + id)
      .send({ jobTitle: newJobTitle });

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.bio");
    expect(res.body).toHaveProperty("data.jobTitle", newJobTitle);
  });

  it("should return the updated author if it is a valid update, only name", async () => {
    id = "9a0be2f8-1709-11e9-ab14-d663bd873d93"; //existing id in the file
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
    id = uuidv1();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should abort deleting an author if he/she has books written by them", async () => {
    id = "f6aed6a0-1709-11e9-ab14-d663bd873d93";
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

  it("should return 500", async () => {
    sortBy = 123;
    page = 2;
    size = 15;
    var res = await request(server)
      .post("/api/author/")
      .send({ page, size, sortBy });

    expect(res.status).toBe(500);
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
