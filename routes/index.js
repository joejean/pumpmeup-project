var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var Request = require('request');

/*Check if JSON object is empty*/
var isEmpty = function(obj){
  return Object.keys(obj).length === 0;
};


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html');
});

router.post('/', function(req, res){
  var searchTerm = req.body.searchQuery;
  var  url = "http://"+req.hostname+"/api/quotes/search/"+searchTerm;
  if (process.env.NODE_ENV != 'production'){
    url = "http://"+req.hostname+":3000"+"/api/quotes/search/"+searchTerm;
  }

  Request.get(url, function(err, response, body){
    if(!err && response.statusCode ==200){
      var result= JSON.parse(body);

    }
    if(isEmpty(result)){
      var err = "We could not find quotes for the keyword you entered. Please try a new word.";
      res.render('index.html', {quotes:result, error: err });
    }
    res.render('index.html', {quotes:result });
  });

});

router.get('/apidoc', function(req, res){
  res.render('api.html');
});

router.get('/add', function(req, res){
  res.render('add.html');
});

router.post('/add', function(req, res){
  var quote = req.body.quote;
  var author = req.body.author;
  var success = undefined;
  var error = undefined;
  var  url = "http://"+req.hostname+"/api/quotes";
  if (process.env.NODE_ENV != 'production'){
    url = "http://"+req.hostname+":3000"+"/api/quotes";
  }
  Request.post({
    url: url,
    form:{
      quote: quote,
      author: author
    }
  },
  function (err, response, body) {
    if (res.statusCode == 200){
        success = JSON.parse(body);
        res.render('add.html', {error: error, success: success});
  }
  else{

      error = "Sorry, Your quote was not added";
      res.render('add.html', {error: error, success: success});
  }

});

 });


router.get('/top', function(req, res){

  var url = "http://"+req.hostname+"/api/quotes/trend";
  if (process.env.NODE_ENV != 'production'){
    url = "http://"+req.hostname+":3000"+"/api/quotes/trend";
  }

  Request.get(url, function(err, response, body){
    if(!err && response.statusCode ==200){
      var result= JSON.parse(body);

    }
    res.render('top10.html', {quotes:result });
  });

});





module.exports = router;
