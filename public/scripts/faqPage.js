/**
* サーバーとクライアントとで、テンプレートエンジンのコード形式がかぶるので、
* クライアントサイドのプレイスホルダを変更する。
**/
_.templateSettings = {
    interpolate: /\{\{=([^}]*)\}\}/g,
    evaluate: /\{\{(?!=)(.*?)\}\}/g,
    escape: /\{\{-([^}]*)\}\}/g
};
/**
 * 一覧画面制御変数
 */
var faqPage = faqPage || {
    totalRows : 0,          //全文書件数
    rowsParPage : 10,       //1ページあたりの行数
    totalPages : 0,         //全ページ数
    currentPage : 0         //現在のページ
};
/**
 * 一覧画面を更新する。
 * 行数、開始位置は一覧画面制御変数を使用する。
 */
faqPage.updateListPage = function(){
    loading.show();         //ロード中GIFの表示
    var url = '/api/faqlist/by_modified';
    var query = utils.objectToQuery({               //この関数がオブジェクトをクエリパラメータに変換する
        skip :  (this.currentPage - 1) * this.rowsParPage, //サーバーに何文書目から表示するかを指示
        limit : this.rowsParPage,                   //サーバーに文書数を指示
        descending : true                           //降順での取得を指示
    });
    url += query;
    $.ajax({
        url:url,
        method : 'GET',
        dataType : 'json'
    })
    //サーバーから一覧を取得できたら画面に表示する。
    . done(function( data, textStatus, jqXHR ){
        var rowtemplate = _.template($('#rowtemplate').text()), //１行分のHTMLを生成するためのテンプレート（underscore.jsを使用する）
            rowsHtml = "",                                      //１行文のHTMLを格納する変数領域
            listBody = $('#list_body');                         //生成されたHTMLを挿入するエンドポイント
        listBody.empty();
        faqPage.totalRows = parseInt(data.total_rows,10);                           //全文書件数の再計算
        faqPage.totalPages = Math.ceil(faqPage.totalRows / faqPage.rowsParPage);    //全ページ数の再計算
        $.each(data.rows,function(index, val){                                      //読み込んだ文書毎の処理
            var val = val.value;
            if(val.title.length == 0){
                val.title = "<なし>"
            }
            val.modified = moment(val.modified).format('YYYY-MM-DD HH:mm:ss');      //modifiedをYYYY-MM-DD HH:mm:ss形式にして（moment.jsを使用する）、元の値を置き換える
            var rowText = rowtemplate(val);                                         //テンプレートからHTMLコードを生成
            var rowObj = $(rowText);                                                //HTMLコードをDOMに変換
            $('#list_body').append(rowObj);                                         //DOMをエンドポイントに挿入する
        });
        
    })
    //@TODO エラー制御
    .fail(function( jqXHR, textStatus, errorThrown ){

    })
    .always(function(){
        loading.hide();                                                             //ロード中GIFの消去
    });
};

/**
 * 文書をサーバーに保存する。
 * フォームデータを元にオブジェクトを生成し、サーバーに送信する。
 * 新規文書か否かによりPostとGetの切り替えを行う。
 * @param {function} successCallback 成功時のコールバック
 * @param {function} errorCallback 失敗時のコールバック
 * @param {function} alwaysCallback 成功、失敗に関わらず最後に実行させるコールバック
 */
faqPage.saveDocument = function(successCallback,errorCallback,alwaysCallback){

    var url = '/api/faq';
    var method = 'POST';
    //入力データからポストデータの生成
    var data = {
        title   : $('#title').val(),
        content : CKEDITOR.instances.content.getData()
    };
    //更新の場合、文書IDがフォームに設定しているので、ここでmethodの決定を行う。
    if($('#_id').val().length > 0){
        data._id = $('#_id').val();
        data._rev = $('#_rev').val();
        data.created = $('#created').val();
        method = 'PUT';
        url += ('/' + $('#_id').val());
    }
    $.ajax({
        url : url,
        method : method,
        data : data,
        dataType : 'json'
    })
    .done(successCallback)
    .fail(errorCallback)
    .always(successCallback);
};

/**
 * 文書をサーバから削除する。
 * 文書削除用のURLをパラメータを元に生成し、サーバに削除要求を投げる。
 * @param {string} id 削除する文書のID
 * @param {string} rev 削除する文書のRevision
 * @param {function} successCallback 成功時のコールバック
 * @param {function} errorCallback 失敗時のコールバック
 * @param {function} alwaysCallback 成功、失敗に関わらず最後に実行させるコールバック
 */
faqPage.deleteDocument = function(id, rev, successCallback, errorCallback, alwaysCallback){
  var method = 'DELETE';
  var url = '/api/faq/' + id + '?rev=' + rev;
  $.ajax({
      url : url,
      method : method,
      dataType : 'json'
  })
    .done(successCallback)
    .fail(errorCallback)
    .always(successCallback);
};

/**
 * 文書をサーバーから読み込む。
 * idをキーにサーバーから文書データを取得する。
 * @param {string} id 文書の_id
 * @param {function} successCallback 成功時のコールバック
 * @param {function} errorCallback 失敗時のコールバック
 * @param {function} alwaysCallback 成功、失敗に関わらず最後に実行させるコールバック
 */
faqPage.readDocument = function(id, successCallback, errorCallback,alwaysCallback){
    var url = '/api/faq';
    url += ('/' + id);
    $.ajax({
        url : url,
        method : 'GET',
        dataType : 'json'
    })
    .done(successCallback)
    .fail(errorCallback)
    .always(alwaysCallback)
};

/**
 * idをキーにサーバーから文書データ取得し、文書表示領域用のDOMを更新する。
 * @param {string} id 文書の_id
 */
faqPage.setDispPageData = function(id){
    loading.show();
    faqPage.readDocument(id,
        function( data, textStatus, jqXHR ){
            if(data.title){
                $('#title-disp').text(data.title);
            }
            if(data.modified){
                $('#displaymodified').text(moment(data.modified).format('YYYY-MM-DD HH:mm:ss')); 
                $('#modified').val(data.modified);
            }
            if(data.created){
                $('#displaycreated').text(moment(data.created).format('YYYY-MM-DD HH:mm:ss')); 
                $('#created').val(data.created);
            }
        
            $('#_id').val(data._id);
            $('#_rev').val(data._rev);
            
            $('#content-disp').append($(data.content));
        },
        //@TODO エラー制御
        function(){

        },
        function(){
            loading.hide();
        }
    );
};

/**
 * 新規編集画面を表示
 */
faqPage.setNewPageData = function(){
    loading.show();
    CKEDITOR.replace('content');
    loading.hide();
};

/**
 * idをキーにサーバーから文書データ取得し、文書表示領域用のDOMを更新する。
 * @param {string} id 文書の_id
 */
faqPage.setEditPageData = function(id){
    loading.show();
    faqPage.readDocument(id,
        function( data, textStatus, jqXHR ){
            if(data.title){
                $('#title').val(data.title);
            }
            if(data.modified){
                $('#displaymodified').text(moment(data.modified).format('YYYY-MM-DD HH:mm:ss')); 
                $('#modified').val(data.modified);
            }
            if(data.created){
                $('#displaycreated').text(moment(data.created).format('YYYY-MM-DD HH:mm:ss')); 
                $('#created').val(data.created);
            }
        
            $('#_id').val(data._id);
            $('#_rev').val(data._rev);
            
            CKEDITOR.replace('content');
            CKEDITOR.instances.content.setData(data.content,{
                callback : function(){
                    loading.hide();
                }
            });
        },
        //@TODO エラー制御
        function(){
            
        },
        function(){
            loading.hide();
        }
    );
};
