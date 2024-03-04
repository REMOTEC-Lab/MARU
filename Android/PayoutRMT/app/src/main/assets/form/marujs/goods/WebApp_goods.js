/**
 * 각각의 버튼 이벤트 처리
 */
 //메인 블럭의 이벤트
var Evnt = {
    "btn": {
        "MCOFFEE": {
            Request: function (e, PageBlock) {
                //console.log('response : MCOFFEE, ' + oPageInfo.page + ', ' + PageBlock.attr('id') + ', ' + PageBlock.closest('[data-role="body"]').attr('id'));
                //oPageInfo.page : goods, PageBlock.attr('id') : goods_coffee, PageBlock.closest('[data-role="body"]').attr('id') : goods-body
                if (oPageInfo.id != 'goods_coffee') {
                    try {
                        requestPage.call(this, {
                            url: 'html/goods/goods_coffee.html',
                            //target_id: 'goods-body',
                            id: 'goods_coffee'
                        });
                    } catch (e) { console.log(e); }
                    action_Activate('goods', 'BTN', '{"MDRINK":"deactive","MSIDE":"deactive"}');
                    Maru_goods.btn_changeChildPage('goods_coffee');
                }
            },
            Response: function (data) {
            }
        },
        "MDRINK": {
            Request: function (e, PageBlock) {
                if (oPageInfo.id != 'goods_drink') {
                    try {
                        requestPage.call(this, {
                            url: 'html/goods/goods_drink.html',
                            //target_id: 'goods-body',
                            id: 'goods_drink'
                        });
                    } catch (e) { console.log(e); }
                    action_Activate('goods', 'BTN', '{"MCOFFEE":"deactive","MSIDE":"deactive"}');
                    Maru_goods.btn_changeChildPage('goods_drink');
                }
                //Maru_goods.btn_IsMEMBER();
            },
            Response: function (data) {
            }
        },
        "MSIDE": {
            Request: function (e, PageBlock) {
                if (oPageInfo.id != 'goods_side') {
                    try {
                        requestPage.call(this, {
                            url: 'html/goods/goods_side.html',
                            //target_id: 'goods-body',
                            id: 'goods_side'
                        });
                    } catch (e) { console.log(e); }
                    action_Activate('goods', 'BTN', '{"MCOFFEE":"deactive","MDRINK":"deactive"}');
                    Maru_goods.btn_changeChildPage('goods_side');
                }
            },
            Response: function (data) {
                //var dir = data.split('_')[0];
            }
        },
        "G_MINUS": {
            Request: function (e, PageBlock) {
            }
        },
        "G_PLUS": {
            Request: function (e, PageBlock) {
            }
        },
        "G_ERASER": {
            Request: function (e, PageBlock) {
            }
        },
        "GLIST_UP": {
            Request: function (e, PageBlock) {
            }
        },
        "GLIST_DOWN": {
            Request: function (e, PageBlock) {
            }
        },
        "ALL_DEL": {
            Request: function (e, PageBlock) {

            }
        },
        "GO_HOME": {
            Request: function (e, PageBlock) {
                //console.log('Request : GO_HOME');
                Maru_goods.btn_goHOME();
            },
            Response: function () {
                //console.log('response : GO_HOME');
                try {
                    requestPage.call(this, {
                        url: 'html/start.html',
                        target_id: 'start-body',
                        id: 'start_one'
                    });
                } catch (e) { console.log(e); }
            }
        },
        "PAYMENT": {
            Request: function (e, PageBlock) {
                Maru_goods.btn_Payment();
            }
        }
    },
    "input" : {
    }
};

