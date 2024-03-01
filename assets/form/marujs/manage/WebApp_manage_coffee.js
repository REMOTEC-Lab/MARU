//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "COFFEE_DELETE": {
            Request: function (e, PageBlock) {
            },
            Response: function (data) {
            }
        },
        "COFFEE_EDIT": {
            Request: function (e, PageBlock) {
            },
            Response: function (data) {
            }
        }, 
        "CONFIRM": {
            Request: function (e, PageBlock) {
                Maru_manage.btn_Confirm();
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
    var sChild = 'manage_coffee';
    $('#' + sChild).unbind('onload').bind("onload", function () {
        //console.log( 'Page Load '+$(this).attr('id') ) ;
        Event_bind($(this).attr('id'));
    });
    // 페이지 보여질때 실행
    $('#' + sChild).unbind('pageshow').bind("pageshow", function () {
        //console.log( 'Page Open '+$(this).attr('id') ) ;
        try {
            Maru_manage.pageLoaded(sChild);
        } catch (e) { }
        //console.log('Page Open 2' + $(this).attr('id'));
    });
    // 페이지 빠져나갈때 실행
    $('#' + sChild).unbind('beforeunload').bind("beforeunload", function () {
        //console.log( 'Page Close '+$(this).attr('id') ) ;
        try {
            Maru_manage.pageEnd(sChild);
        } catch (e) { }
    });
})();