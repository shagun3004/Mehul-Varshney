const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require('fs'); 
const path = require('path');
const multer = require('multer');
const imgModel = require('./model');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-aditya:Mathematics@01@cluster0.x5vhu.mongodb.net/mehulPortfolio", { useNewUrlParser: true,useUnifiedTopology: true });

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
const upload = multer({ storage: storage });

//home route
app.get("/",function(req,res){
    res.render("home");
});

app.get("/portfolio",function(req,res){
    imgModel.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            res.render('portfolio', { items: items }); 
        } 
    }); 
});

app.get("/contact",function(req,res){
    res.render("contact");
});

// Uploading the image 
app.post('/compose', upload.single('image'), (req, res, next) => { 

	var obj = { 
		name: req.body.name, 
		desc: req.body.desc, 
		img: { 
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
			contentType: 'image/png'
		} 
	} 
	imgModel.create(obj, (err, item) => { 
		if (err) { 
			console.log(err); 
		} 
		else { 
			item.save(); 
			res.redirect('/portfolio'); 
		} 
	}); 
}); 

app.get("/compose",function(req,res){
    res.render("compose");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running !");
});
  
