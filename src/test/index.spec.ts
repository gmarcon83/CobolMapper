import chai from "chai";
import { CobolMapper } from "..";

const simpleArr = [
  { name: "myProp1", pic: "X(8)" },
  { name: "myProp2", pic: "X(6)" },
  { name: "myProp3", pic: "9(5)" },
  { name: "myProp4", pic: "9(10)" },
];

chai.should();
describe("Cobol Mapper", () => {
  it("Should create a new CM instance", (done) => {
    try {
      const arr = [
        { name: "myProp1", pic: "X(8)" },
        { name: "myProp2", pic: "9(5)" },
        { name: "myProp3", pic: "S9(2)" },
        { name: "myProp4", pic: "S9(5)V(2)" },
      ];
      new CobolMapper(arr);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should parse a COBOL data value", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      cm.setValue("A23     BX      1230012345678");
      cm.myProp1.should.equal("A23");
      cm.myProp2.should.equal("BX");
      cm.myProp3.should.equal(123);
      cm.myProp4.should.equal(12345678);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should set values via JS object and extract a COBOL data", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      cm.myProp1 = "A23";
      cm.myProp2 = "BX";
      cm.myProp3 = 123;
      cm.myProp4 = 12345678;
      cm.getValue().should.equal("A23     BX    001230012345678");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should return an array of properties names", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      const arrStr = cm.getProperties().toString();
      arrStr.should.equal("myProp1,myProp2,myProp3,myProp4");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should throw an error of string too long (whole object)", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      const op = () => cm.setValue("A23     BX      12300123456789");
      op.should.Throw("Expected string of length 29");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should throw an error of string too long (single property)", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      const op = () => (cm.myProp2 = "TestSTR");
      op.should.Throw("Value TestSTR too big, maximum length of 6");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should throw an error of received string, expected number (whole object)", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      const op = () => cm.setValue("A23     BX    Test 0012345678");
      op.should.Throw(
        "Expected a number on property myProp3, instead received Test"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should throw an error of received string, expected number (single property)", (done) => {
    try {
      const arr = simpleArr;
      const cm = new CobolMapper(arr);
      const op = () => (cm.myProp3 = "TestSTR");
      op.should.Throw(
        "Expected a number on property myProp3, instead received TestSTR"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should throw an error of error parsing PIC", (done) => {
    try {
      const arr = [{ name: "myProp1", pic: "S9999" }];
      const op = () => new CobolMapper(arr);
      op.should.Throw(
        "Expected a number on property myProp3, instead received TestSTR"
      );
      done();
    } catch (err) {
      done(err);
    }
  });
});
