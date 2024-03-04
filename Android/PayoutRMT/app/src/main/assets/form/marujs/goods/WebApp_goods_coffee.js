//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "PAGE_PREV": {
            Request: function (e, PageBlock) {
                //console.log('PAGE_PREV :');
                Maru_goods.btn_NextPage(oPageInfo.id, ('p').charCodeAt());
            },
        },
        "PAGE_NEXT": {
            Request: function (e, PageBlock) {
                //console.log('PAGE_NEXT :');
                Maru_goods.btn_NextPage(oPageInfo.id, ('n').charCodeAt());
            },
        },
        "ANCHOR": {
            Request: function (e, PageBlock) {
                var index = $(this).data('name');
                //console.log('response : ANCHOR, ' + index + ', ' + oPageInfo.page + ', ' + PageBlock.attr('id'));
                //console.log(oPageInfo.id + ', ' + oPageInfo.seq + ', ' + oPageInfo.cont_id + ', ' + oPageInfo.url);
                //console.log(oPageInfo.pageid + ', ' + oPageInfo.parentId);
                //Maru_goods.btn_SelectGOODS(PageBlock.attr('id').split('_')[1], index);
                //Maru_goods.btn_SelectGOODS(PageBlock.attr('id'), index);
                Maru_goods.btn_SelectGOODS(index);
            }
        },
        "EXIT": {
            Request: function (e, PageBlock) {
                try {
                    Maru_goods.btn_EXIT();
                } catch (e) { }
            },
            Response: function (data) {
            }
        }
    },
    "input" : {
    }
};

(function(){
// 페이지 로딩완료 후 실행
    $('#goods_coffee').unbind('onload').bind("onload", function(){
		//console.log( 'Page Load '+$(this).attr('id') ) ;
		Event_bind( $(this).attr('id') );
	});
	// 페이지 보여질때 실행
    $('#goods_coffee').unbind('pageshow').bind("pageshow", function(){
        //console.log( 'Page Open '+$(this).attr('id') ) ;
	    try{
            Maru_goods.pageLoaded('goods_coffee') ;
        } catch (e) { }
        //console.log('Page Open 2' + $(this).attr('id'));
	});
	// 페이지 빠져나갈때 실행
    $('#goods_coffee').unbind('beforeunload').bind("beforeunload", function(){
		//console.log( 'Page Close '+$(this).attr('id') ) ;
        try{
            Maru_goods.pageEnd('goods_coffee') ;
        }catch(e){}
	});
})();