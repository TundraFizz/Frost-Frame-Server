var app  = require("../server.js");
var fs   = require("fs"); // File system library

TestingFunction = function(){
  console.log("This is a function");
}

AppendToFile = function(file, data){
  var io = data["firstName"] + "," + data["lastName"] + "," + data["age"] + "\n";
  fs.appendFileSync("data/people.csv", io);
}

CsvToObject = function(file){
  var people = [];
  var fileContents = fs.readFileSync(file);
  var lines = fileContents.toString().split("\n");

  for(var i = 0; i < lines.length; i++){
    if(lines[i]){
      var data = lines[i].split(",");
      people.push({"firstName": data[0],
                   "lastName":  data[1],
                   "age":       data[2]});
    }
  }

  return people;
}

app.post("/add-person", function(req, res){
  AppendToFile("data/people.csv", req.body);
  var people = CsvToObject("data/people.csv");
  res.json(people);
});

app.get("/", function(req, res){
  TestingFunction();

  var string = "A string from the server.";
  var people = [
    {name: "Adam", age: 10},
    {name: "Bob",  age: 12},
    {name: "Carl", age: 15}
  ];

  res.render("index.ejs", {
    people: people,
    string: string
  });
});

app.get("/about", function(req, res){
  var people = CsvToObject("data/people.csv");
  res.render("about.ejs", {people: people});
});

//////////////////////////////////////////////////

var multer = require("multer");
var upload = multer({"dest":"temp"});

app.post("/qwerty", upload.any(), function(req, res, next){
  var body = req.body;
  var files = req.files;

  if(files.length > 1){
    res.json("Error: User tried to upload more than one file");
    return;
  }

  console.log("===============================================");
  console.log(body["key"]);
  console.log("===============================================");

  var fileOrig = files[0]["originalname"];
  var fileName = files[0]["filename"];
  var filePath = files[0]["path"];
  var fileSize = files[0]["size"];
  var fileType = files[0]["mimetype"];

  if(fileType != "image/png"){
    res.json("Error: Invalid MIMEtype");
    return;
  }

  var newName = "";
  var characters = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ];

  for(var i = 0; i < 6; i++)
    newName += characters[Math.floor(Math.random() * 62)];
  newName += ".png";

  var input  = fs.createReadStream(filePath);
  var output = fs.createWriteStream("static/uploads/" + newName);

  input.pipe(output);

  input.on("end", function(){
    var obj = {
      "url": "http://localhost:9001/" + newName
    };

    res.json(obj);

    fs.unlink(filePath, (err) => {
      if(err)
        throw err;
    });
  });
});

app.post("/abcde", function(req, res){
  console.log(req.body);
  // console.log(req["my_field"]);
  // console.log(req.file);
  // console.log("GOT SOMETHING!");
  res.json("Hello there");
});

//////////////////////////////////////////////////

app.use(function (req, res){
  res.render("404.ejs");
});
