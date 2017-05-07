var brandName='保守対応履歴';
var viewTools = {
    /**
     * レスポンスbodyに以下を追加する。
     * bodyが空の場合は新たに作成する。
     * titleが含まれていない場合は、brandNameを付与する。
     * req.flashにメッセージが含まれている場合は、それらを付与する。
     * refererを付与する。
     * @param {Object} req リクエストオブジェクト
     * @param {Object} body メッセージボディ
     */
	addCommonItems:function(req,body){
        if(typeof body === 'undefined' || body === null){
            body = {};
        }
        if(req.user){
            body.user = req.user;
        }
        if(req.flash){
            body.error = req.flash('error');
            body.warning = req.flash('warning');
            body.success = req.flash('success');
            body.info = req.flash('info');
        }
        body.brand = brandName;
        if(!body.title){
        	body.title = body.brand;
        }
        if(req.headers && req.headers['referer']){
            body.referer = req.headers['referer'];
        }else{
            body.referer = '/';
        }
        return body;
    },
    /**
     * （調査中）一覧画面のpagerを生成する。
     */
    generatePager:function(baseUrl,currentPage,lastPage){
    	var pager={},
    		showableMax = 5,
    		start,
    		last;
    	pager.firstPage = {};
    	pager.lastPage  = {};
    	pager.pages = [];

		if(baseUrl.indexOf('?') === -1){
	    	pager.firstPage.url = baseUrl + '?page=1';
	    	pager.lastPage.url = baseUrl + '?page=' + lastPage;
    	}else{
        	pager.firstPage.url = baseUrl + '&page=1';
        	pager.lastPage.url = baseUrl + '&page=' + lastPage;
    	}
    	pager.firstPage.label = '|<=';
    	pager.lastPage.label = '=>|';
    	
    	if(lastPage <= showableMax){
        	//lastPageがshowableMax以下なら、1からlastPageとする。
    		start = 1;
    		last = lastPage;
    	}else{
    		//totalPagesがshowableMaxより大きかったら、
    		if(currentPage + showableMax > lastPage){
    	    	//currentPage+showableMaxがlastPageより大きかったら、lastPage-showableMaxからlastPageとする。
    			start = lastPage - showableMax;
    			last = lastPage;
    		}else{
    	    	//でなければ、currentPageからcurrentPage+showableMaxとする。
    			start = currentPage;
    			last = currentPage + showableMax;
    		}
    	}
    	for(var i = start ; i <= last ; i++){
    		var page = {};
    		if(baseUrl.indexOf('?') === -1){
        		page.url = baseUrl + '?page=' + i;
    		}else{
    			page.url = baseUrl + '&page=' + i;
    		}
    		page.label = i;
    		pager.pages.push(page);
    	}
    	return pager;
    }
};

module.exports = viewTools;