var express = require('express');
var router = express.Router();
var Quote = require('../models/quote');


/* */
router.route('/quotes')
  .get(function(req, res){
    Quote.find(function(err, quotes){

      if (err) {
        return res.send(err);
      }

      res.json(quotes);

    });
  })
  .post(function(req, res){
    var quote = new Quote(req.body);
    quote.save(function(err){
      if(err){
        return res.send(err);
      }
      res.json({message:'Quote Added'})
    });
  });

router.route('/authors')
  .get(function(req, res){
    Quote.find({},{author:1}, function(err, authors){
      if(err){
        return res.send(err);
      }
      return res.json(authors);
    });
  });

router.route('/quotes/trend/')
  .get(function(req, res){
    Quote.find({}).sort({likes:'desc'}).limit(10).exec(function(err, quotes){
      if(err){
        return res.send(err);
      }

      return res.send(quotes);
    });
});

router.route('/quotes/:id')
  .get(function(req, res){

    Quote.findOne({_id:req.params.id}, function(err, quote){
      if (err){
        return res.send(err);
      }
      return res.json(quote);
    })
  });

router.route('/quotes/like/:id')
  .put(function(req, res){
    Quote.findOne({ _id:req.params.id}, function(err, quote){
      if (err){
        return res.send(err);
      }
      //increment the likes counter by 1
      quote.set('likes', quote.likes+1);

      //save the quote
      quote.save(function(err){
        if (err){
          return res.send(err);
        }
        return res.json({message:"Quote Updated!"});
      });

    });
  })
  .delete(function(req, res){
    Quote.remove({ _id: req.params.id}, function(err, movie){

      if(err){
        return res.send(err);
      }
      res.json({message:"Quote Deleted!"});

    });

  });

  router.route('/quotes/search/:term')
    .get(function(req, res){
      searchTerm = req.params.term;
      Quote.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: "textScore" } }
        ).sort( { score: { $meta: "textScore" } } ).limit(10)
        .exec(function(err, quotes){
          if (err){
            return res.send(err);
          }

          return res.json(quotes);
        });
    });

router.route('/quotes/authors/:authorName')
  .get(function(req, res){
    Quote.find({author: req.params.authorName}, function(err, quotes){
      if(err){
        return res.send(err);
      }

      return res.json(quotes);
    })
  })

module.exports = router;
