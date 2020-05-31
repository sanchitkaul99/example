var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var app=express();
var expressSanitizer=require("express-sanitizer");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Mongoose Model
var blogSchema= new mongoose.Schema({
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
//Restful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});
app.get("/blogs/new",function(req,res){
    res.render("new");
});
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("show",{blog:foundBlog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("edit",{blog:foundBlog});
        }
    })
})
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,removedBlog){
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs");
        }
    })
})
app.listen(3000,function(){
    console.log("Server is running at port 3000");
})