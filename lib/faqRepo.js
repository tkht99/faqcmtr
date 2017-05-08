/**
 * 照会対応履歴レポジトリ
 */
var fs = require('fs');
var cloudant;
var db;
var dbCredentials = {};
var vcapServices = {};

//cloudantのデータベース名
dbCredentials.dbName = 'faqcmtr';

//process.env.VCAP_SERVICESの有無によりBluemix下での稼動かどうかを判定
//Bluemix下でない場合は、ローカルのvcap-local.jsonの情報を元に同等の情報を生成。
if (process.env.VCAP_SERVICES) {
    vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} else {
    vcapServices = JSON.parse(fs.readFileSync("vcap-local.json", "utf-8"));
}

//VCAP_SERVICESからcloudantへのアクセス情報を取得。
for (var vcapService in vcapServices) {
    if (vcapService.match(/cloudant/i)) {
        dbCredentials.url = vcapServices[vcapService][0].credentials.url;
    }
}

//cloudantのアクセスクライアント生成（cloudantを使用。実体はnanoらしい。。）
cloudant = require('cloudant')(dbCredentials.url);

cloudant.db.create(dbCredentials.dbName, function(err, res) {
    if (err) {
        console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
    }else{
        console.log('db: ' + dbCredentials.dbName + ', created.');
    }
});

//cloudantに接続
db = cloudant.use(dbCredentials.dbName);

//viewが作成されたなかったら作成する。
db.view('faqs', 'by_modified', {}, function(err, res){
    if(err){
        db.insert({
            _id : "_design/faqs",
            views : {
                by_modified : {
                    map : "function (doc) {\n  emit(doc.modified, doc);\n}"
                }
            },
            language : "javascript"
        },function(err, res){
            if(err){
                console.log('cannot create view!!');
            }else{
                console.log('view created.');
            }
        });
    }
});

//全文検索用インデックスが作成されてなかったら作成する。
db.search('faqSearch', 'content', {}, function(err, res){
    if(err){
        var idx_exp = "";
        idx_exp += "function (doc) {\n";
        idx_exp += " var df = \"\";\n";
        idx_exp += " if(doc.title){\n";
        idx_exp += "  df = doc.title;\n";
        idx_exp += "  index(\"title\", doc.title, {store : 'yes'})\n";
        idx_exp += " }\n";
        idx_exp += " if(doc.content){\n";
        idx_exp += "  df += (\" \" + doc.content)\n";
        idx_exp += "  index(\"content\", doc.content, {store : 'yes'})\n";
        idx_exp += " }\n";
        idx_exp += " index(\"default\", df, {store : 'yes'});\n";
        idx_exp += "}";
        db.insert({
            _id : "_design/faqSearch",
            views : {},
            indexes : {
                content :{
                    analyzer : "japanese",
                    index : idx_exp
                }
            },
            language : "javascript"
        },function(err, res){
            if(err){
                console.log("cannot create search index");
            }else{
                console.log('search index created.');
            }
        });
    }
});

//crud operations
function create(data, callback){
    db.insert(data, callback);
}
function read(id, callback){
    db.get(id, callback);
}
function update(data, callback){
    db.insert(data, callback);
}
function del(id, rev, callback){
    db.destroy(id, rev, callback);
}
//list operations
function list(params, callback){
    db.view('faqs', 'by_modified', params, callback);
}

function faqSearch(params, callback){
    db.search('faqSearch', 'content', params, callback);
}

module.exports = {
    create : create,
    update : update,
    read : read,
    list : list,
    del : del,
    faqSearch : faqSearch
};