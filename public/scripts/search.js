$(function(){
    $('#searchForm').submit(function(){
        if($('#searchWord').val().length < 1){
            return false;
        }
        return true;
    });
});