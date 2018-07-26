var express = require('express'),
    typeis = require('type-is'),
    parser = require('xml2json'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    fs = require('fs'),
    path = require('path');

const foldersmq = 'smq/';
const folderandreani = 'andreani/';
const dirpath = path.join(__dirname, 'files_xmls/');

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
  limit: '5MB'
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

var eventosdnandreani = mongoose.model("eventoandreani", nameSchema);

// XML Response Route
app.post('/sdn/save', function (req, res) {
    //console.log(req.body);
    //console.log("=================================================================");
    //console.log("=================================================================");
    var options = {
        object: true,
        alternateTextNode: true
     };
    var json = parser.toJson(req.body, options);
    //console.log(typeof json);
    //console.log("REQ.BODY to json -> %s", json);
    var eventoObjeto = new eventosdn({evento : json});
    //console.log("=================================================================");
    //console.log("=================================================================");
    //console.log("JSON to objetomongo -> %s", eventoObjeto);
    //console.log("=================================================================");
    //console.log("=================================================================");
    eventoObjeto.save((result, err) =>{
        if(!err) {
            const rutafinal = (dirpath+foldersmq);
            fs.writeFile(rutafinal+"error_"+Date()+".txt", req.body+"\r\n"+"----------"+"\r\n"+eventoObjeto)
          }

    }).then((result)=>{
        const rutafinal = (dirpath+foldersmq+result["_id"]+".xml");
        //console.log("El path final es:"+ rutafinal);
        fs.writeFile(rutafinal, req.body)

    }).catch(err => {
        console.log(err);
     });
    
    
})


app.post('/andreani/sdn/save', function (req, res) {
    //console.log(req.body);
    //console.log("=================================================================");
    //console.log("=================================================================");
    var options = {
        object: true,
        alternateTextNode: true
     };
    var json = parser.toJson(req.body, options);
    //console.log(typeof json);
    //console.log("REQ.BODY to json -> %s", json);
    var eventoObjeto = new eventosdnandreani({evento : json});
    //console.log("=================================================================");
    //console.log("=================================================================");
    //console.log("JSON to objetomongo -> %s", eventoObjeto);
    //console.log("=================================================================");
    //console.log("=================================================================");
    eventoObjeto.save((result, err) =>{
        if(!err) {
            const rutafinal = (dirpath+folderandreani);
            fs.writeFile(rutafinal+"error_"+Date()+".txt", req.body+"\r\n"+"----------"+"\r\n"+eventoObjeto)
          }

    }).then((result)=>{
        const rutafinal = (dirpath+folderandreani+result["_id"]+".xml");
        //console.log("El path final es:"+ rutafinal);
        fs.writeFile(rutafinal, req.body)

    }).catch(err => {
        console.log(err);
     });
    
    
})

//.. Run Server
let server = app.listen(3000, function () {
    //console.log('API running at', server.address().port);
});