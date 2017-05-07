/**
 * 照会対応一覧 RESTサービスAPI
 * 
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var repository = require('../../lib/faqRepo');

router.route('/by_modified')
.get(function( req, res, next ){
    res.type('application/json');
    var params = req.query;
    repository.list(params,function(err, list){
        if(!err){
            res.status(200).send(list);
        }else{
            console.log(err);
            res.status(500).send(); //ここは500で良いかな。。。
        }
    });
});

module.exports=router;
