var express = require('express'),
    typeis = require('type-is'),
    parser = require('xml2json'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose");

var app = express();

var xmlParseOptions = {
  async: false,   // Setting to `true` causes issues with exceptions
  explicitArray: false,
  trim: true,
  normalize: true,
  normalizeTags: true,
  mergeAttrs: true,
  charkey: 'value',
  attrNameProcessors: [function(attr) {
    return '@' + attr;
  }]
};

app.use(bodyParser.text({
  type: '*/xml',
  limit: '1MB'
}));

app.use(function(req, res, next) {
  if(!typeis.hasBody(req) || !typeis(req, '*.xml')) {
    return next();
  }
   // Parse as XML
  var parser = new xml2js.Parser(xmlParseOptions);
  parser.parseString(req.body, function(err, xml) {
    if(err) {
      err.status = 400;
      return next(err);
    }
    req.body = xml || req.body;
    next();
  });
});


//Config Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.168.1.20:27017/testtest");
var nameSchema = new mongoose.Schema({ any : {}  }, {strict : false});


//Modelos

//Modelo SMQ
var eventosdn = mongoose.model("evento", nameSchema);



// XML Response Route
app.post('/sdn/save', function (req, res) {
    console.log(req.body);
    console.log("=================================================================");
    console.log("=================================================================");
    var options = {
        object: true,
        alternateTextNode: true
     };
    var json = parser.toJson(req.body, options);
    console.log(typeof json);
    console.log("REQ.BODY to json -> %s", json);
    var eventoObjeto = new eventosdn({evento : json});
    console.log("=================================================================");
    console.log("=================================================================");
    console.log("JSON to objetomongo -> %s", eventoObjeto);
    console.log("=================================================================");
    console.log("=================================================================");
    eventoObjeto.save()
        .then(item => {
            console.log("Name saved to database");
        })
        .catch(err => {
            console.log("Unable to save to database");
        });
    
    
})

//.. Run Server
let server = app.listen(3000, function () {
    console.log('API running at', server.address().port);
});