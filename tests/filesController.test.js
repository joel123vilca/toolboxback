const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app");
const filesService = require("../src/services/filesService");

chai.should();
chai.use(chaiHttp);

describe("Files Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /files/data", () => {
    it("should return an array of file info", async () => {
      const fileInfoArrayMock = [
        { file: "test.txt", lines: ["line 1", "line 2"] },
      ];
      sinon.stub(filesService, "getFilesInfo").resolves(fileInfoArrayMock);

      const response = await chai.request(app).get("/files/data");

      response.should.have.status(200);
      response.body.should.be.an("array");
      response.body.should.deep.equal(fileInfoArrayMock);
    });

    it("should handle errors and return Internal Error", async () => {
      const errorMessage = "An internal error occurred";
      sinon.stub(filesService, "getFilesInfo").throws(new Error(errorMessage));

      const response = await chai.request(app).get("/files/data");

      response.should.have.status(500);
      response.body.should.deep.equal({ error: "Internal Error" });
    });
  });

  describe("GET /files/data/detail", () => {
    it("should return file info for a specific file name", async () => {
      const fileName = "test.txt";
      const fileInfoDetailMock = {
        file: fileName,
        lines: ["line 1", "line 2"],
      };
      sinon
        .stub(filesService, "getFileByQueryparam")
        .resolves(fileInfoDetailMock);

      const response = await chai
        .request(app)
        .get(`/files/data/detail?fileName=${fileName}`);

      response.should.have.status(200);
      response.body.should.be.an("object");
      response.body.should.deep.equal(fileInfoDetailMock);
    });

    it("should handle errors and return Internal Error", async () => {
      const fileName = "test.txt";
      const errorMessage = "An internal error occurred";
      sinon
        .stub(filesService, "getFileByQueryparam")
        .withArgs(fileName)
        .throws(new Error(errorMessage));

      const response = await chai
        .request(app)
        .get(`/files/data/detail?fileName=${fileName}`);

      response.should.have.status(500);
      response.body.should.deep.equal({ error: "Internal Error" });
    });
  });
});
