const createServer = require("../src/server");
const supertest = require("supertest");
const app = createServer("test/photos.test.db", "test/albums.test.db");

beforeEach((done) => {
  done();
})

afterEach((done) => {
  done();
})

test("GET /pictures", async () => {
  await supertest(app)
    .get("/api/pictures")
    .expect(200)
    .then((response) => {
      // Check response type
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body.length).toEqual(2);

      // Check contents
      expect(response.body[0].fileName).toEqual("pic1.jpg");
      expect(response.body[1].fileName).toEqual("pic2.jpg");
      expect(response.body[0].albumTitle).toEqual("test");
      expect(response.body[1].albumTitle).toEqual("test");
    })
})

test("GET /albums", async () => {
  await supertest(app)
    .get("/api/albums")
    .expect(200)
    .then((response) => {
      // Check response type
      expect(Array.isArray(response.body)).toBeTruthy()
      
      // Check contents
      expect(response.body.some((element) => element.name === "test")).toBeTruthy();
      expect(response.body.some((element) => element.name === "test2")).toBeTruthy();
      expect(response.body.some((element) => element.name === "not-test")).toBeFalsy();
    })
})

test("POST /albums", async () => {
  const data = {
    album: "test_abc",
  }
  
  await supertest(app)
    .post("/api/albums")
    .send(data)
    .expect(200)
    .then((response) => {
      expect(response.body.msg).toEqual("album created");
    })

  await supertest(app)
    .get("/api/albums")
    .expect(200)
    .then((response) => {
      const len = response.body.length;
      const test = (element) => element.name === "test_abc";
      expect(response.body.some(test)).toBeTruthy();
    })
})

