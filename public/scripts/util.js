//utilities
var utils = utils || {};
utils.objectToQuery = function(obj){
    var arr = [],
        query = '';
        
    for(key of Object.keys(obj)){
        arr.push(key + "=" + obj[key]);
    }
    if(arr.length > 0){
        query += '?';
        query += arr.join('&');
    }
    return query;
}