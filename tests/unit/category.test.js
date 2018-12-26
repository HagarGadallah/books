const uuidv4 = require("uuid/v4");
const request = require("supertest");
const server = require("../../../app");
const category = require("../../../api/models/category");
const { readAll } = require("../../../api/models/db/db");
const _ = require("lodash");

describe("GET /api/category/:id", () => {
  afterEach(async () => {
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
  afterEach(async () => {
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

  it("should return the category if it is valid", async () => {
    name = "test category";
    const res = await exec();

    expect(res.body).toHaveProperty("data.id");
    expect(res.body).toHaveProperty("data.name", "test category");
  });
});

describe("PUT api/update/category/:id", () => {
  var newName;
  var id = "dc1d741a-d4e9-4e64-b33a-4eeb0970903c"; //existing id in the file

  const exec = async () => {
    return await request(server)
      .put("api/update/category/" + id)
      .send({ name: newName });
  };

  // it("should return 400 if category's name is empty", async () => {
  //   newName = "        ";

  //   const res = await exec();

  //   expect(res.status).toBe(400);
  // });

  it("should return 404 if id is invalid", async () => {
    id = 1;
    newName = "updated name";

    const res = await exec();

    expect(res.status).toBe(404);
  });

  // it("should return 404 if category with the given id was not found", async () => {
  //   id = mongoose.Types.ObjectId();

  //   const res = await exec();

  //   expect(res.status).toBe(404);
  // });

  //SHOULD BE UNCOMMENTEDDDDD
  // it("should update the category if input is valid", async () => {
  //   await exec();

  //   const updatedGenre = await Genre.findById(genre._id);

  //   expect(updatedGenre.name).toBe(newName);
  // });

  // it("should return the updated category if it is valid", async () => {
  //   newName = "updated name";
  //   const res = await exec();

  //   expect(res.body).toHaveProperty("data.id");
  //   expect(res.body).toHaveProperty("data.name", newName);
  // });
});

// describe("POST /api/category", () => {
//   afterEach(async () => {
//     await server.close();
//   });

//   it("should return 200 if all categories are retrieved", async () => {
//     afterEach(async () => {
//       await server.close();
//     });

//     var res = await readAll();
//     var categories = res.categories;
//     var message = "Categories loaded successfully";

//     //expect(res.body).toContain(message);
//     expect(res.body).toHaveProperty("data");
//   });
// });
