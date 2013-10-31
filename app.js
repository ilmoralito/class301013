var express = require('express')
var http = require('http')
var app = express()
var mongoose = require('mongoose')//invocar mongoose

//conectar mongoose a una BD de la computadora local
mongoose.connect('mongodb://localhost/test');
//Crear el modelo de la BD
var Anime = mongoose.model('Anime', { name: String, wiki:String });

app.set("view engine", "jade")
app.set("views", "./views")
app.use(express.bodyParser());
app.use(express.static('./public'));

app.get('/', function(req, res){
    Anime.find({}, function(errors, animes){
        res.render("index",{animes:animes})
    })
});

app.get("/create", function(req, res){
    res.render("create")
})

app.post("/create", function(req, res){
    var name = req.body.name
    var wiki = req.body.wiki
    
    var anime = new Anime({name:name, wiki:wiki})
    
    anime.save(function(err){
        if (err) throw err
        
        console.log(name + " con wiki " + wiki + " guardado")
        
        res.redirect("/create")
    })
})

app.get("/delete/:name", function(req, res){
    var name = req.params.name
    
    Anime.findOneAndRemove({name:name}, function(err, result){
        console.log(result)
    })
    
    res.redirect("/")
})

app.get("/edit/:name", function(req, res){
    var name = req.params.name
    
    Anime.findOne({name:name}, function(err, anime){
        res.render("edit", {anime:anime})
    })
})

app.post("/update", function(req, res){
    var id = req.body.id
    var name = req.body.name
    var wiki = req.body.wiki
    
    Anime.update({name:id},{name:name, wiki:wiki}, function(err){
        console.log("Editado")
    })
    
    res.redirect("/")
})

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});
