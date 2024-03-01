/**
 * 각각의 버튼 이벤트 처리
 */
 //메인 블럭의 이벤트
var Evnt = {
    "btn": {
        "LOGOUT": {
            Request: function (e, PageBlock) {
                Maru_manage.btn_goLogout();
            },
            Response: function () {
                try {
                    requestPage.call(this, {
                        url: 'html/login.html',
                        target_id: 'login-body',
                        id: 'login_one'
                    });
                } catch (e) { console.log(e); }
            }
        },
        "APPEND": {
            Request: function (e, PageBlock) {
                Maru_manage.btn_Append();
            }
        }
    },
    "input" : {
    }
};

