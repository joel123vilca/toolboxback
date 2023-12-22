const { expect, use } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const chaiAsPromised = require("chai-as-promised");
const csvUtils = require("../src/utils/csvUtils");
const filesService = require("../src/services/filesService");

use(chaiAsPromised);

describe("Files Service", () => {
  describe("getFilesInfo", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("should handle errors gracefully", async () => {
      sinon
        .stub(axios, "get")
        .withArgs(`${filesService.API_URL}/files`)
        .rejects(new Error("Network error"));

      await expect(filesService.getFilesInfo())
        .to.be.eventually.an("array")
        .and.have.lengthOf(0);
    });
  });
});
