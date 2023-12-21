const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Files Controller", () => {
  it("should return files information", async () => {
    const res = await chai.request(app).get("/files/data");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
});
