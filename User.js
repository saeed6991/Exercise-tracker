


let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
});

const siteSchema = new mongoose.Schema({
  username: String,
});

module.exports = mongoose.model("User", siteSchema);




