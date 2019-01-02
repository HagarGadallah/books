const uuidv4 = require("uuid/v4");
const request = require("supertest");
const server = require("../../app");
const category = require("../../api/models/category");
const { readAll } = require("../../api/models/utilities/utilities");
const _ = require("lodash");

describe("GET /api/category/:id", () => {
  afterAll(async () => {
    await server.close();
  });

  it("should return category if valid id is passed", async () => {
    // existing id in the file
    const id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c";
    await category.readCategoryById(id);

    const res = await request(server).get("/api/category/" + id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data.name");
  });

  it("should return 404 if invalid id is passed", async () => {
    const res = await request(server).get("/api/category/1");

    expect(res.status).toBe(404);
  });

  // it("should return 404 if no category with the given id exists", async () => {
  //   const id = uuidv4();
  //   const res = await request(server).get("/api/category/" + id);

  //   expect(res.status).toBe(404);
  // });
});

describe("POST /api/category/create", () => {
  afterAll(async () => {
    await server.close();
  });

  //variables
  var name;
  var category;
  var categoryId = uuidv4();

  //mosh's abstraction
  const exec = async () => {
    return await request(server)
      .post("/api/category/create")
      .send({ name });
  };

  it("should return 500", async () => {
    name = 500;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if category's name is empty", async () => {
    name = "       ";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should save the category if it is valid", async () => {
    name = "test category";
    const data = await readAll();

    await exec();

    category = _.find(data.categories, function(i) {
      return i.id == categoryId;
    });

    expect(category).not.toBeNull();
  });

  it("should return the category if it is created successfully", async () => {
    name = "test name";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.name", "test name");
  });
});

describe("PUT /api/update/category/:id", () => {
  var newName;
  var id;

  const exec = async () => {
    return await request(server)
      .put("/api/update/category/" + id)
      .send({ name: newName });
  };

  it("should return 500", async () => {
    id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c";
    newName = 500;
    var res = await exec();

    expect(res.status).toBe(500);
  });

  it("should return 400 if category's name is empty", async () => {
    id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c";
    newName = "            ";
    const res = await exec();
    expect(res.status).toBe(400);
    //expect(res.body).toHaveProperty("data","Invalid data, please send valid data and try again");
  });

  it("should return 404 if category with the given id was not found", async () => {
    id = uuidv4();
    newName = "updated name";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  // it("should return 404 if id is invalid", async () => {
  //   id = 1;
  //   const res = await exec();
  //   expect(res.status).toBe(404);
  // });

  // it("should update the category if input is valid", async () => {
  //   newName = "updated name";
  //   id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c"; //existing id in the file
  //   const data = await readAll();
  //   await exec();
  //   var updatedCategory = _.find(data.categories, function(i) {
  //     return i.id == id;
  //   });
  //   expect(updatedCategory.name).toBe(newName);
  // });

  it("should return the updated category if it is a valid update", async () => {
    id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c"; //existing id in the file
    newName = "updated name";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.name", newName);
  });
});

describe("DELETE /api/delete/category/:id", () => {
  var id;

  const exec = async () => {
    return await request(server)
      .delete("/api/delete/category/" + id)
      .send();
  };

  // it('should return 404 if id is invalid', async () => {
  //   id = 1;
  //   const res = await exec();
  //   expect(res.status).toBe(404);
  // });

  it("should return 404 if no category with the given id was found", async () => {
    id = uuidv4();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  // it('should delete the genre if input is valid', async () => {
  //   await exec();
  //   const genreInDb = await Genre.findById(id);
  //   expect(genreInDb).toBeNull();
  // });

  it("should abort deleting the category if it has books listed under it", async () => {
    id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "data",
      "Cannot delete a category, without deleting books under it first"
    );
  });

  it("should return the removed category", async () => {
    id = "e7c15bc8-078c-4b6f-b416-803688ffd9bf";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id", id);
    expect(res.body).toHaveProperty("data.name", "test category");
  });
});

describe("POST /api/category", () => {
  var page, size, sortBy;

  afterAll(async () => {
    await server.close();
  });

  it("should return 200 if all categories are retrieved", async () => {
    var res = await request(server).post("/api/category/");
    var message = "Categories loaded successfully";

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", message);
  });

  it("should return last 10 records in file if page number exceeded records in file", async () => {
    page = 100;
    var res = await request(server)
      .post("/api/category/")
      .send({ page });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    // expect(res.body).toHaveProperty("data.name", "test category");
  });

  it("should return last 10 records in file if page number exceeded records in file, sorted", async () => {
    page = 100;
    sortBy = "name";
    var res = await request(server)
      .post("/api/category/")
      .send({ page, sortBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });

  it("should return first 10 records in file if page number is -ve", async () => {
    page = -100;
    var res = await request(server)
      .post("/api/category/")
      .send({ page });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });

  it("should return first 10 records in file if page number is -ve, sorted", async () => {
    page = -100;
    sortBy = "name";
    var res = await request(server)
      .post("/api/category/")
      .send({ page, sortBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });

  it("should return records based on page number and size given", async () => {
    page = 1;
    size = 5;
    //sortBy = "name";
    var res = await request(server)
      .post("/api/category/")
      .send({ page, size });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.data[0]).toHaveProperty("name", "Alena Graham");
  });

  it("should return records based on page number and size given, sorted", async () => {
    page = 1;
    size = 5;
    sortBy = "name";
    var res = await request(server)
      .post("/api/category/")
      .send({ page, size, sortBy });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.data[4]).toHaveProperty("name", "Roger Lakin");
  });
});
