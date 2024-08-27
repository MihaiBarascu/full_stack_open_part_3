const mongoose = require("mongoose");
const url = process.env.URL;

mongoose.connect(url);
mongoose.set("strictQuery", false);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
