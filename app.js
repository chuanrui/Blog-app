var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
//title
//image
//body
//created
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static("public"));//use files in public
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//schema setup, index route and template
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {
            type: Date, 
            default: Date.now
        }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//     {
//         title: "Puppy",
//         image:"https://images.unsplash.com/photo-1446730853965-62433e868929?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
//         body:"a lovely puppy"
//     },function(err, blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });
//RESTFUL ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    });
});
//CREATE ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blog", function(req, res){
    //create blog then redirect
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            console.log(err);
        }else{
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});
//show info of specified blog
//SHOW ROUTE
app.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    });
});
//EDIT and UPDATE
app.get("/blog/:id/edit", function(req, res) {
    //first use SHOW ROUTE
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    });
});

app.put("/blog/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blog/"+req.params.id);
        }
    });
});
//DELETE ROUTE
app.delete("/blog/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!!!");
});
