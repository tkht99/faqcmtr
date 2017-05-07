var loading = loading || {
    show:function(){
        var l = $('#loading');
        if(l.length == 0){
            $("body").append("<div id='loading'></div>");
        }
    },
    hide:function(){
        $("#loading").remove();
    }
};