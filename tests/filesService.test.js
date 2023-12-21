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

    it("should return formatted files information", async () => {
      sinon
        .stub(axios, "get")
        .withArgs(`${filesService.API_URL}/files`)
        .resolves({ data: { files: ["file1.csv", "file2.csv"] } })
        .withArgs(`${filesService.API_URL}/file/file1.csv`)
        .resolves({ data: "text,number,hex\nRgTya,123,abcdef" })
        .withArgs(`${filesService.API_URL}/file/file2.csv`)
        .resolves({ data: "text,number,hex\nAnotherText,456,fedcba" });

      sinon
        .stub(csvUtils, "fromString")
        .onFirstCall()
        .resolves([{ text: "RgTya", number: "123", hex: "abcdef" }])
        .onSecondCall()
        .resolves([{ text: "AnotherText", number: "456", hex: "fedcba" }]);

      const result = await filesService.getFilesInfo();

      expect(result).to.be.an("array").and.have.lengthOf(2);
      expect(result[0]).to.have.property("file", "file1.csv");
      expect(result[0])
        .to.have.property("lines")
        .that.is.an("array")
        .and.have.lengthOf(1);
      expect(result[0].lines[0]).to.deep.equal({
        text: "RgTya",
        number: 123,
        hex: "abcdef",
      });
      expect(result[1]).to.have.property("file", "file2.csv");
      expect(result[1])
        .to.have.property("lines")
        .that.is.an("array")
        .and.have.lengthOf(1);
      expect(result[1].lines[0]).to.deep.equal({
        text: "AnotherText",
        number: 456,
        hex: "fedcba",
      });
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
