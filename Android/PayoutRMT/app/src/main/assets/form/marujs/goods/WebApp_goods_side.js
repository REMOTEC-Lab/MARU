//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "EXIT2": {
            Request: function (e, PageBlock) {
                try {
                    Maru_goods.btn_EXIT();
                } catch (e) { }
            },
            Response: function (data) {
            }
        }
    },
    "input": {
    }
};

(function () {
    // 페이지 로딩완료 후 실행
    $('#goods_side').unbind('onload').bind("onload", function () {
        //console.log( 'Page Load '+$(this).attr('id') ) ;
        Event_bind($(this).attr('id'));
    });
    // 페이지 보여질때 실행
    $('#goods_side').unbind('pageshow').bind("pageshow", function () {
        //console.log( 'Page Open '+$(this).attr('id') ) ;
        try {
            Maru_goods.pageLoaded('goods_side');
        } catch (e) { }
        //console.log('Page Open 2' + $(this).attr('id'));
    });
    // 페이지 빠져나갈때 실행
    $('#goods_side').unbind('beforeunload').bind("beforeunload", function () {
        //console.log( 'Page Close '+$(this).attr('id') ) ;
        try {
            Maru_goods.pageEnd('goods_side');
        } catch (e) { }
    });
})();
