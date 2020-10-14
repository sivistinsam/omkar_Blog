var express = require('express');
var router = express.Router();
var bodyParser   = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://omkar:*Sivistin23451@cluster0-shard-00-00.ocpia.mongodb.net:27017,cluster0-shard-00-01.ocpia.mongodb.net:27017,cluster0-shard-00-02.ocpia.mongodb.net:27017/Blogs?ssl=true&replicaSet=atlas-ma8c7f-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true , 
  useUnifiedTopology: true
}).then(()=>{
  console.log("Connection.db! Successful");
}).catch(err => {
  console.log('ERROR:', err.message);
});

//Mongoose Model config
var blogSchema = new mongoose.Schema({
  title: String,
  subtitle:String,
  author:String,
  image: String,
  body: String,
  created: {type: Date , default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({
//   title:"Man must explore, and this is exploration at its greatest",
//   subtitle:"Problems look mighty small from 150 miles up",
//   author:"Imran",
//   image: "https://www.esa.int/var/esa/storage/images/19716864-11-eng-GB/ESA_root_pillars.jpg",
//   body: "Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center — an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.Science cuts two ways, of course; its products can be used for both good and evil. But there's no turning back from science. The early warnings about technological dangers also come from science.What was most significant about the lunar voyage was not that man set foot on the Moon but that they set eye on the earth.A Chinese tale tells of some men sent to harm a young girl who, upon seeing her beauty, become her protectors rather than her violators. That's how I felt seeing the Earth for the first time. I could not help but love and cherish her.For those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience mostcertainly changes your perspectiv. The things that we share in our world are far more valuable than those which divide us.l"
// });

/* GET home page. */
router.get('/', function(req, res ){
  res.redirect("/blogs");
})

router.get('/blogs', function(req, res, next) {
  Blog.find({},function(err, blogs){
    if(err){
      console.log("Error!")
    }else {
      res.render('index', { blogs: blogs });
    }
  });
});

router.get('/blogs/new',function(req, res){
  res.render("blogs/new"); 
});

router.post("/blogs", function(req, res){
  // get data from form and add to campgrounds array
  var title = req.body.title;
  var subtitle = req.body.subtitle;
  var image = req.body.image;
  var body = req.body.body;
  // var author = {
  //     id: req.user._id,
  //     username: req.user.username
  // }
  var author = req.body.author;
  var newBlog = {title: title, subtitle: subtitle, image: image, body: body, author:author}
  // Create a new campground and save to DB
  Blog.create(newBlog, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          //redirect back to campgrounds page
          console.log(newlyCreated);
          res.redirect("/blogs");
      }
  });
});


router.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id).populate("comments").exec(function(err, blogs){
    if(err){
        console.log(err);
    } else {
        console.log("foundBlog")
        //render show template with that campground
        res.render("blogs/posts", {blogs: blogs});
    }
});
});



module.exports = router;
