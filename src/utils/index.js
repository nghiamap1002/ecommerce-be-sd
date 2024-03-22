const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongo = (id) => new Types.ObjectId(id);

const getIntoData = (object = {}, fields = []) => {
  return _.pick(object, fields);
};

const unGetIntoData = (object = {}, fields = []) => {
  let newObject = object;
  if (object._doc) newObject = object._doc;
  return _.omit(newObject, fields);
};

const getSelectData = (select, number = 1) => {
  return Object.fromEntries(select.map((ele) => [ele, number]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((ele) => {
    if (obj[ele] == null) {
      delete obj[ele];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const res = updateNestedObjectParser(obj[k]);
      Object.keys(res).forEach((a) => {
        console.log(a, "a");
        final[`${k}.${a}`] = res[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

module.exports = {
  getIntoData,
  unGetIntoData,
  getSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongo,
};
