/**
 * Module dependencies.
 */
var http = require('http'),
    express = require('express'),
    path = require('path'),
    session = require('express-session'),
    flash = require('express-flash'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorHandler = require('errorhandler');

var app = express();

//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
  secret:'swordfishmeguro',
  cookie:{maxAge: 600000},
  store: session.Memorystore,
  resave: true,
  saveUninitialized: false
}));
app.use(flash());

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//router ui
app.use('/', require('./routes/index'));
app.use('/faq', require('./routes/faq'));
app.use('/faq/search', require('./routes/search'));

//router api
app.use('/api/faq', require('./routes/api/faqApi'));
app.use('/api/faqlist', require('./routes/api/faqListApi'));

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
