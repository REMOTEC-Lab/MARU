//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "TEST": {
            Request: function (e, PageBlock) {
                window['Maru_' + oPageInfo.page].btn_Test();
                //Maru_start.
            },
//            Response: function () {
//                console.log('response : TEST');
//            }
        },
        "GO_MANAGE": {
            Request: function (e, PageBlock) {
                // 더블클릭 한경우
//                doubleClick_event.call(this, {
//                    'double': function(){
//                        try{
//                            //console.log('Request : GO_MANAGE');
//                            window['Maru_' + oPageInfo.page].btn_goMANAGE();
//                        }catch(e){}
//
//                    }//,
//                    'single': function(){
//                        try{
//                            Android_edit.Request_BTN_OK_CLICK(1);
//                        }catch(e){}
//
//                    }
//                });
            },
            Response: function () {
                //console.log('response : GO_MANAGE');
                try {
                    requestPage.call(this, {
                        url: 'html/manage/manage_coffee.html',
                        target_id: 'manage-body',
                        id: 'manage_coffee'
                    });
                } catch (e) { console.log(e); }
            }
        },
        "RESTART": {
            Request: function (e, PageBlock) {
                // 더블클릭 한경우
                doubleClick_event.call(this, {
                    'double': function(){
                        try{
                            //console.log('Request : GO_MANAGE');
                            window['Maru_' + oPageInfo.page].btn_PrjReboot();
                        }catch(e){}

                    }
                });
            },
            Response: function (data) {
            }
        },
        "EXIT": {
            Request: function (e, PageBlock) {
                try {
                    Maru_start.btn_EXIT();
                } catch (e) { }
            },
            Response: function (data) {
            }
        }
    },
    "input" : {
    },
    "combo": {
    }
};

(function(){
    var sChild = oPageInfo.page + '_one';
    // 페이지 로딩완료 후 실행
    $('#' + sChild).unbind('onload').bind("onload", function(){
		//console.log( 'Page Load '+$(this).attr('id') ) ;
		Event_bind( $(this).attr('id') );
	});
	// 페이지 보여질때 실행
    $('#' + sChild).unbind('pageshow').bind("pageshow", function(){
        //console.log( 'Page Open '+$(this).attr('id') ) ;
	    try{
            window['Maru_' + oPageInfo.page].pageLoaded(sChild) ;
            //Maru_start.pageLoaded(sChild);
	    }catch(e){}
	});
	// 페이지 빠져나갈때 실행
    $('#' + sChild).unbind('beforeunload').bind("beforeunload", function(){
		//console.log( 'Page Close '+$(this).attr('id') ) ;
        try{
            window['Maru_' + oPageInfo.page].pageEnd(sChild) ;
            //Maru_start.pageEnd(sChild);
        }catch(e){}
	});
})();