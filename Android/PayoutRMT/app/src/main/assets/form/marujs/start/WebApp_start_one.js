//서브블럭의 이벤트
var add_Evnt = {
    "btn": {
        "IS_MEMBER": {
            Request: function (e, PageBlock) {
                Maru_start.btn_IsMEMBER();
            },
            Response: function () {
                //console.log('response : IS_MEMBER');
                try {
                    requestPage.call(this, {
                        url: 'html/goods/goods_coffee.html',
                        target_id: 'goods-body',
                        id: 'goods_coffee'
                    });
                } catch (e) { console.log(e); }
            }
        },
        "GO_MENAGER": {
            Response: function () {
                console.log('response : GO_MENAGER');
                try {
                    requestPage.call(this, {
                        url: 'html/login/login_one.html',
                        target_id: 'login-body',
                        id: 'login_one'
                        //url: 'form/html/profile/profile_one.html',
                        //target_id: 'profile-body',
                        //id: 'profile_one'
                        //url: 'form/html/setting/setting_one.html',
                        //target_id: 'setting-body',
                        //id: 'setting_one'
                        //url: 'form/html/coffee/coffee_one.html',
                        //target_id: 'coffee-body',
                        //id: 'coffee_one'
                        //url: 'form/html/profile/profile_one.html',
                        //target_id: 'profile-body',
                        //id: 'profile_one'
                    });
                } catch (e) { console.log(e); }
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
    var sChild = 'start_one';
    // 페이지 로딩완료 후 실행
    $('#start_one').unbind('onload').bind("onload", function(){
		//console.log( 'Page Load '+$(this).attr('id') ) ;
		Event_bind( $(this).attr('id') );
	});
	// 페이지 보여질때 실행
    $('#start_one').unbind('pageshow').bind("pageshow", function(){
        //console.log( 'Page Open '+$(this).attr('id') ) ;
	    try{
            Maru_start.pageLoaded(sChild) ;
	    }catch(e){}
	});
	// 페이지 빠져나갈때 실행
    $('#start_one').unbind('beforeunload').bind("beforeunload", function(){
		//console.log( 'Page Close '+$(this).attr('id') ) ;
        try{
            Maru_start.pageEnd(sChild) ;
        }catch(e){}
	});
})();