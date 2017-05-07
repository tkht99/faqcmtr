var express = require('express');
//var passport = require('passport');
var router = express.Router();
var repository = require('../lib/faqRepo');
var viewTools = require('../lib/viewtools');

router.route('/')
.post(function( req, res, next ){
    var body = {
        searchword : req.body.q
    };
    repository.faqSearch(req.body, function(err, result){
        if(!err){
            body.total_rows = result.total_rows;
            body.rows = result.rows;
            res.render('search.html',viewTools.addCommonItems(req,body));
        }else{
            console.log(err);
            res.status(500).send(result);
        }
    });
});

module.exports = router;