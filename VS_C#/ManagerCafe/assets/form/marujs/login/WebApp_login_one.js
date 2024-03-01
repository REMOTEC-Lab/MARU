//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "LOGIN": {
            Request: function (e, PageBlock) {
                Maru_login.btn_Login();
                //try {
                //    requestPage.call(this, {
                //        url: 'html/manage/manage_coffee.html',
                //        target_id: 'manage-body',
                //        id: 'manage_coffee'
                //    });
                //} catch (e) { console.log(e); }
            },
            Response: function () {
                //console.log('LOGIN : Response');
                try {
                    requestPage.call(this, {
                        url: 'html/manage/manage_coffee.html',
                        target_id: 'manage-body',
                        id: 'manage_coffee'
                    });
                } catch (e) { console.log(e); }
            }
        }
    },
    "input" : {
    }
};

(function(){
// 페이지 로딩완료 후 실행
    $('#login_one').unbind('onload').bind("onload", function(){
		//console.log( 'Page Load '+$(this).attr('id') ) ;
		Event_bind( $(this).attr('id') );
	});
	// 페이지 보여질때 실행
    $('#login_one').unbind('pageshow').bind("pageshow", function(){
        //console.log( 'Page Open '+$(this).attr('id') ) ;
	    try{
            Maru_login.pageLoaded('login_one') ;
	    }catch(e){}
	});
	// 페이지 빠져나갈때 실행
    $('#login_one').unbind('beforeunload').bind("beforeunload", function(){
		//console.log( 'Page Close '+$(this).attr('id') ) ;
        try{
            Maru_login.pageEnd('login_one') ;
        }catch(e){}
	});
})();