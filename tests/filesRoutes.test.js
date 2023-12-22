let server = require("../app");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("Files Routes", () => {
  describe("GET /files/data should return an array of file info", () => {
    it("It should return files", (done) => {
      chai
        .request(server)
        .get("/files/data")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          response.body.length.should.not.be.eq(0);
          done();
        });
    });

    it("It should NOT return the files", (done) => {
      chai
        .request(server)
        .get("/files/dates")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
    it("GET /files/data/detail should return file info for a specific file name", (done) => {
      const fileName = "test2.csv";
      chai
        .request(server)
        .get(`/files/data/detail?fileName=${fileName}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });
  });
});
