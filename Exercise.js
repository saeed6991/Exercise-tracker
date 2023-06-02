





let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
});

const siteSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
  user_id: String
});

module.exports = mongoose.model("Exercise", siteSchema);



