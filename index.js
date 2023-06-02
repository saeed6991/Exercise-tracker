const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");
const urlParser = require('url');
const User = require("./User");
const Exercise = require("./Exercise");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users/', async (req, res) => {
  try {
    const new_username = req.body.username;
    console.log(new_username);
    const users = await displayUsers();
    const data = await findByUsername(new_username);
    console.log(data);
    if (data.length === 0) {
      let new_user = new User({ username: new_username});
      await new_user.save();
      console.log("new user saved!" + new_user.username);
    } else {
      console.log("User already exists!");
    }

    const updatedData = await findByUsername(new_username);
    res.json({
      username: updatedData[0].username,
      _id: updatedData[0]._id
    });
  } catch(err) {
    console.log("error occured " + err);
  } 
});

app.get('/api/users', (req, res) => {
  let users= []
  displayUsers().then(data => {
    data.forEach(d=>{
      users.push({username: d.username, _id: d._id});
    });
    res.send(users);
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date): new Date();
  console.log('this date '+ date)
  try {
    const user = await User.findById(id);
    let new_exercise = new Exercise({
     username: user.username,
     description: description,
     duration: duration,
     date: new Date(date),
     user_id: id
     });
     await new_exercise.save();
     console.log("new exercise saved!");
     res.json({
       _id: id,
       username: new_exercise.username,
       description: new_exercise.description,
       duration: new_exercise.duration,
       date: new_exercise.date.toDateString()
     });
   } catch(err) {
     console.log(err)
   }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const from = req.query.from;
    const limit = req.query.limit;
    const to = req.query.to;
    const id = req.params._id.toString();
    console.log(req.query)
    console.log(id)
    let objQuery = {}
    const user_details = await Exercise.find({ user_id: id});
    if (user_details.length != 0) {
      objQuery.username = user_details[0].username;
    }
    if (from && !to) {
      obj = { '$gte' : new Date(from)};
      objQuery.date = obj;
    }
    if (to && !from) {
      obj = { '$lte' : new Date(to)};
      objQuery.date = obj;
    }
    if (from && to) {
      obj = { '$gte' : new Date(from), '$lte' : new Date(to)};
      objQuery.date = obj;
    }
    console.log(objQuery)
    let user_exercises = await Exercise.find(objQuery).limit(limit?limit:20).exec();
    let log = [];
    await user_exercises.forEach(u=>{
      let obj ={
        description: u.description,
      duration: u.duration,
      date: u.date.toDateString(),
      }
      log.push(obj)
    })
    console.log(log);
    res.json({
      username: user_details[0].username,
      count: user_exercises?user_exercises.length:0,
      _id: id,
      log: log
    })
  } catch(err) {
    console.log(err);
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


const findByUsername = (name) => {
  return User.find({ username: name});
}

const displayUsers = () => {
  return User.find({});
};
