import { Test } from "./Test";

describe("Test class", function () {
  it("should have the correct setup", function () {
    const name = "name";
    const test = new Test(name);
    expect(test.state).toEqual(name);
  });
});
