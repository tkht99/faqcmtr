var express = require('express');
var router = express.Router();
var viewTools = require('../lib/viewtools');

router.route('/')
.get(function( req, res, next ){
	res.redirect('/faq/list');
});

router.route('/disp/:id')
.get(function( req, res, next ){
	var body={};
//	req.flash('info','message');
	return res.render('faq_disp.html',viewTools.addCommonItems(req,body));
});

router.route('/edit/:id')
.get(function( req, res, next ){
	var body={};
//	req.flash('info','message');
	return res.render('faq_edit.html',viewTools.addCommonItems(req,body));
});

router.route('/list')
.get(function( req, res, next ){
	var body={};
//	req.flash('info','message');
	return res.render('faq_list.html',viewTools.addCommonItems(req,body));
});

router.route('/new')
.get(function( req, res, next ){
	var body={};
//	req.flash('info','message');
	return res.render('faq_edit.html',viewTools.addCommonItems(req,body));
});

module.exports = router;