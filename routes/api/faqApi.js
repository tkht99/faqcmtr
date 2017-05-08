/**
 * 照会対応文書 RESTサービスAPI
 * 
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var repository = require('../../lib/faqRepo');

router.route('/')
.post(function( req, res, next ){
    req.body.created = new Date();
    req.body.modified = new Date();
    res.type('application/json');
    repository.create(req.body,function(err, body){
       if(!err){
           res.status(201).send(body);
       }else{
           console.log(err);
           //@TODO RESTfulに乗っ取ったエラーコードを返す。
           res.status(500).send();
       }
    });
});

router.route('/:id')
.get(function( req, res, next ){
    res.type('application/json');
    repository.read(req.params.id,function(err, body){
        if(!err){
            res.status(200).send(body);
        }else{
            console.log(err);
           //@TODO RESTfulに乗っ取ったエラーコードを返す。
            res.status(500).send();
        }
    });
    
})
.put(function( req, res, next ){
    req.body.modified = new Date();
    req.body._id = req.params.id;
    res.type('application/json');
    repository.update(req.body,function(err, body){
       if(!err){
           res.status(201).send(body);
       }else{
           console.log(err);
           //@TODO RESTfulに乗っ取ったエラーコードを返す。
           res.status(500).send();
       }
    });
    
})
.delete(function( req, res, next ){
    if(!req.params.id){
        res.status(400).send({err : "不正なURL"});
    }
    if(!req.query.rev){
        res.status(400).send({err : "不正なパラメータ"});
    }
    res.type('application/json');
    repository.del(req.params.id, req.query.rev, function(err, body){
        if(!err){
            res.status(200).send(body);
        }else{
            res.status(500).send();
        }
    });
});

module.exports=router;
