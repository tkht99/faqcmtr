var express = require('express');
var passport = require('passport');
var router = express.Router();
var viewTools = require('../lib/viewtools');

router.route('/')
.get(function(req,res,next){
	var body={
			title:'照会対応履歴',
		};
//	req.flash('info','サーバーで設定した情報メッセージ');
//	req.flash('error','サーバーで設定したエラーメッセージ');
//	req.flash('warning','サーバーで設定した警告メッセージ');
//	req.flash('success','サーバーで設定した成功メッセージ');
	return res.render('index.html',viewTools.addCommonItems(req,body));
});
module.exports = router;