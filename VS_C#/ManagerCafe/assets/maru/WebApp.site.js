//"use strict";

var isTouchDevice = 'ontouchstart' in document.documentElement;
var EV_START = isTouchDevice ? 'touchstart' : 'mousedown' ;
var EV_END = isTouchDevice ? 'touchend' : 'mouseup';
var MY_PATH = window.location.pathname.split('form/').shift(); //assets

var MODAL_ID = null;

var getMatches = function(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[0].trim()) ;
    }
    return matches;
};
function _jscss_load(kind, files, callback){

	var loadfile = [];
    if( $.isArray(files) ){
        for(var i in files){
            loadfile.push(files[i]);
        }
    }
    else{
    	loadfile = files ;
    }
    //console.log(kind, loadfile);
    //loadfile = files;
    $(document.getElementsByTagName("head")[0]).jscssfile({
            kind : kind,
            loadfile : loadfile
            ,callback
            //,callback : options.Activate.call($Ele, api)
    }).jscssfile("destroy");
}

var btnAct = function(){
     $(this).addClass('active').removeClass('deactive') ;

      if ( resetTimerID ){
          clearTimeout( resetTimerID );
          resetTimerID = 0;
      }
      var thisObj = $(this) ;
      setTimeout(function(){
          resetTimerID = 0;
          thisObj.addClass('deactive').removeClass('active') ;
      }, 200) ;
};

function sleep (delay) {
   var start = new Date().getTime();
   while (new Date().getTime() < start + delay);
}

var ConfirmModal = {
    /**
    * Modal박스 출력/숨기기
    *
    * @example
        Modal.dialog('show', kinds, '좋겠다!!!!');
    * 'hide' : 숨기기, 'show' : 보이기
    */
    confirmBox: function (view, kinds, message) {
        //if (kinds.toUpperCase().indexOf('EDITMENU') >= 0) {
        //    console.log('MenuModal menuBox : ', view, kinds, message);
        //    return;
        //}
        //console.log('ConfirmModal confirmBox : ', view, kinds, message);
        if ($.modal.isActive() || (view != 'hide' && view != 'show') || kinds.length == 0) {
            return;
        } 
        var dialog = $('#SYS-' + MODAL_ID);
        var dialog_INNER = dialog.find('.inner'); // buttons bloc

        if (view == 'hide') {
            //console.log('KKKKKS 0: ' + 'SYS-' + MODAL_ID);
            dialog_INNER.find('[class*="SYS-MODAL-BTN-"]').addClass('hide').unbind('click');
            dialog_INNER.find('.SYS-TXT-WARNING').html('----< br >********');
            $.modal.close();
            MODAL_ID = null;
            return;
        }
        MODAL_ID = 'CMODAL-' + kinds.toUpperCase();
        //if (view == 'show') 
        dialog = $('#SYS-' + MODAL_ID); // dialog 박스
        //console.log('confirmBox 1: ' + view + ', ' + '#SYS-' + MODAL_ID);
        dialog_INNER = dialog.find('.inner'); // buttons block
        dialog_INNER.find('.SYS-TXT-WARNING').html(message);

        dialog_INNER.find('.SYS-MODAL-BTN-CONFIRM').unbind('click').bind('click', ConfirmModal.Btn['CONFIRM']).removeClass('hide');
        if (dialog_INNER.find('.SYS-MODAL-BTN-CANCEL').length)
            dialog_INNER.find('.SYS-MODAL-BTN-CANCEL').unbind('click').bind('click', ConfirmModal.Btn['CANCEL']).removeClass('hide');

 
        dialog.modal('show');
    },
    Btn: {
        'CONFIRM': function (e) {
            (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
            Maru_app.btn_Sound_BEEP();

            //console.log(oPageInfo.page + ' : Close1');
            //ConfirmModal.confirmBox('hide');
            if (MODAL_ID != null) {
                var dialog = $('#SYS-' + MODAL_ID);
                var dialog_INNER = dialog.find('.inner'); // buttons bloc
                dialog_INNER.find('[class*="SYS-MODAL-BTN-"]').addClass('hide').unbind('click');
                dialog_INNER.find('.SYS-TXT-WARNING').html('----<br>********');
                if (dialog_INNER.find('.SYS-MODAL-BTN-CANCEL').length) {
                    //console.log('Maru_' + oPageInfo.page + ' : 존재 => SYS-MODAL-BTN-CANCEL');
                    window['Maru_' + oPageInfo.page].btn_Confirm();
                }
                sleep(20);
                $.modal.close();
                MODAL_ID = null;
            }

            //if ($(this).attr('data-name') == 'add') {
            //    window['Maru_' + oPageInfo.page].btn_ModalCoffeeAppend(sData);
            //} else if ($(this).attr('data-name') == 'edit') {
            //    window['Maru_' + oPageInfo.page].btn_ModalCoffeeEdit(parseInt(MEM_INPUT['2']), sData);
            //}
        },
        'CANCEL': function (e) {
            (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
            Maru_app.btn_Sound_BEEP();
            if (MODAL_ID != null) {
                var dialog = $('#SYS-' + MODAL_ID);
                var dialog_INNER = dialog.find('.inner'); // buttons bloc
                dialog_INNER.find('[class*="SYS-MODAL-BTN-"]').addClass('hide').unbind('click');
                dialog_INNER.find('.SYS-TXT-WARNING').html('----< br >********');
                $.modal.close();
                MODAL_ID = null;
            }
        }
    }
}

/**
* element SYS-... 정보 얻기
* @param kind ( 'id', 'class' )
* @param name 이름
* @return object
    {
        kind : 'id' or 'class',
        type : 'btn' or 'input',
        name : 이름 (SYS-??-이름)
    }
*/
var get_Ele_info = function(kind, name){
    //console.log('name=> ' + ((kind=='id') ? '#'+name : '.'+name));
    name = name.replace(' ','');//.trim() ;
    var gets = [] ;
    if( name.indexOf('SYS-') >= 0 )
    {
        gets = name.split('-').splice(1) ;
    }
    ////console.log(gets);
    return {
        kind,
        'type' : (gets[0] || '').toLowerCase() || '',
        'name' : (gets[1] || '').toUpperCase() || ''
    } ;
}
var set_keypad = function(kind){
    kind = kind.toUpperCase();
    if(kind == 'POS'){
        if( $('.SYS-KEYPAD-NUM', this).length ){
            $('.SYS-KEYPAD-POS', this).hide();
            $('.SYS-KEYPAD-NUM', this).show();
        }
    }else if(kind == 'NUM'){
        if( $('.SYS-KEYPAD-POS', this).length ){
            $('.SYS-KEYPAD-NUM', this).hide();
            $('.SYS-KEYPAD-POS', this).show();
        }
    }
}
var resetTimerID = 0;

var btn_handler = function(e){
    (e.preventDefault) ? e.preventDefault() : e.returnValue = false;

    //console.log('btn_handler / e.type : ', e.type, this.type) ;

    var Sys_Ele = null ;
    var get_info = null ;
    var prevActivate = ''; // 이전의 상태 (active, deactive)
    var Activate = "" ; // 바뀐 상태 (active, deactive)
    var pageBlock = $(this).closest('[data-role="page"]') ;
    var pageBlock_name = pageBlock.attr('data-page') ;
    var contentBlock = $(this).closest('[data-role="page"]').find('[data-role="body"] > [data-role="content"]:visible') ;
    //var contentBlock = $(this).closest('[data-role]:not([data-role="content"])');
    //var contentBlock = $(this).closest('[data-role="content"]');

    if( this.id.indexOf('SYS-') >= 0 ){
        get_info = get_Ele_info( 'id', this.id) ;
    }else { // className Searching
        //[Warning] 한개만 검색
        get_info = get_Ele_info('class', $(this, contentBlock).attr('class').match( /(SYS-BTN-|SYS-INPUT-|SYS-COMBO-)(.*?)(?:\s|$)/g )[0] ) ;
    }

    //############################
    // 체크박스 (label + checkbox) 인경우
    //############################
    if( this.nodeName.toLowerCase() == 'label'){
        var checkbox_id = $(this).prop('for') ;

        e.stopPropagation();
        e.preventDefault();
        $( '#' + $(this).prop('for') ).trigger('click');

        try{
                var obj = cur_Evnts[get_info.type][get_info.name].Request ;
                if( OFUNC.has_function(obj) ) obj.call(this, e, contentBlock) ;
                else alert("WARNING[Request] !!\n\n [" + get_info.name + "] " +get_info.type+ " Not Defined") ;
        }
        catch(e){
            //console.log( 'not Function => Evnt.'+get_info.type+'.'+get_info.name+'.Request') ;
            console.log(e.message);
        }
        return  false ;
    }
    // 이벤트 종료
    //############################

    ////console.log(get_info) ;

    if( get_info.kind == 'id' ){
        Sys_Ele = $('[id="SYS-' + get_info.type.toUpperCase() + '-' + get_info.name + '"]', contentBlock) ;
    }else if( get_info.kind == 'class' ){
        Sys_Ele = $('.SYS-' + get_info.type.toUpperCase() + '-' + get_info.name, contentBlock) ;
    }

    if(get_info.type == "btn")
    {
        if( ! $(this).hasClass('SYS-toggle') )
        {
            if ($(this).hasClass('SYS-invert')) {
                if (!$(this).hasClass('active')) {
                    return;
                }
                $(this).addClass('deactive').removeClass('active');

                if (resetTimerID) {
                    clearTimeout(resetTimerID);
                    resetTimerID = 0;
                }
                var thisObj = $(this);
                setTimeout(function () {
                    resetTimerID = 0;
                    thisObj.addClass('active').removeClass('deactive');
                }, 200);
            } else {
                $(this).addClass('active').removeClass('deactive');

                if (resetTimerID) {
                    clearTimeout(resetTimerID);
                    resetTimerID = 0;
                }
                var thisObj = $(this);
                setTimeout(function () {
                    resetTimerID = 0;
                    thisObj.addClass('deactive').removeClass('active');
                }, 200);
            }
        }else{
            if(e.type == EV_END)
            {
                if(arguments[1] != 1)
                {
                    Sys_Ele.not(this).closest('.active').triggerHandler(EV_END, 1) ;
                }
                    /*
                var list = Sys_Ele.not(this) ;
                console.log('list', list) ;
                for(var i=0,l=list.length; i < l; i++){
                    //if( $(list[i]).hasClass('active') ) $(list[i]).triggerHandler(ev_name) ;
                    if( $(list[i]).hasClass('active') ) $(list[i]).triggerHandler(ev_name) ;
                }*/
            }
            else{
               if( ! $(this).hasClass('SYS-BTN-POS') &&
               ! $(this).hasClass('SYS-BTN-KEY_MINUS') && ! $(this).hasClass('SYS-BTN-KEY_PLUS') &&
               ! $(this).hasClass('SYS-BTN-KEY_MINUS_EX') && ! $(this).hasClass('SYS-BTN-KEY_PLUS_EX') )
                    Sys_Ele.not(this).addClass('deactive').removeClass('active') ;
            }

            if( $(this).hasClass('active') ) {
                Activate = "deactive" ;

                if( !$(this).hasClass('SYS-disable') ) $(this).addClass('deactive').removeClass('active') ;
                else prevActivate = "active" ;
            }
            else if( $(this).hasClass('deactive')) {
                prevActivate = "deactive" ;
                Activate = "active" ;
                $(this).addClass('active').removeClass('deactive') ;
            }
            else {
                prevActivate = "deactive" ;
                Activate = "active" ;
                $(this).addClass('active').removeClass('deactive') ;
            }
        }
    }else if(get_info.type == 'input'){

        if( ! $(this).hasClass('SYS-toggle') )
        {
            if( !$(this).hasClass('SYS-disable') )
            {
                $(this).addClass('enable').removeClass('disable') ;

                if ( resetTimerID ){
                    clearTimeout( resetTimerID );
                    resetTimerID = 0;
                }
                var thisObj = $(this) ;
                setTimeout(function(){
                    resetTimerID = 0;
                    thisObj.addClass('disable').removeClass('enable') ;
                }, 200) ;
            }
        }else{

            if(e.type == EV_END)
            {
                    Sys_Ele.not(this).closest('.enable').triggerHandler(EV_END, 1) ;
                /*
                var list = Sys_Ele.not(this) ;
                for(var i=0,l=list.length; i < l; i++){
                    if( $(list[i]).hasClass('enable') ) $(list[i]).triggerHandler(ev_name) ;
                }*/
            }
            else{
                Sys_Ele.not(this).addClass('disable').removeClass('enable') ;
            }

            if( $(this).has('SYS-INPUT-UNIT') ) Sys_Ele.not(this).addClass('disable').removeClass('enable') ;

            if( $(this).hasClass('enable') ) {
                Activate = "disable" ;

                if( !$(this).hasClass('SYS-disable') ) $(this).addClass('disable').removeClass('enable') ;
                //else prevActivate = "active" ;

                set_keypad.call(contentBlock, 'num') ;
            }
            else if( $(this).hasClass('disable') ) {
                Activate = "enable" ;
                $(this).addClass('enable').removeClass('disable') ;
                set_keypad.call(contentBlock, 'pos') ;
            }
            else {
                Activate = "enable" ;
                $(this).addClass('enable').removeClass('disable') ;
                set_keypad.call(contentBlock, 'pos') ;
            }
        }
    } else if (get_info.type == 'combo') {
    }

	if( $(this).data('cache') == 'no' ) {
		var requestURL = baseURL + $(this).attr('href') ;

		location.href = requestURL ;
		return false ;
	}

    try{
        var obj = cur_Evnts[get_info.type][get_info.name].Request ;
        if( Activate && OFUNC.has_function(obj) ) obj.call(this, e, contentBlock, Activate, prevActivate) ;
        else if( OFUNC.has_function(obj) ) obj.call(this, e, contentBlock) ;
        else alert("WARNING[Request] !!\n\n [" + get_info.name + "] " +get_info.type+ " Not Defined") ;
    }
    catch(e){
        //console.log( 'not Function => Evnt.'+get_info.type+'.'+get_info.name+'.Request') ;
        console.log(e.message);
    }

	//return false ;
};

var sel_changer = function(e){
    (e.preventDefault) ? e.preventDefault() : e.returnValue = false;

    //console.log('e.type', e.type, this.type) ;

    var Sys_Ele = null ;
    var get_info = null ;
//    var preIndex; // 이전의 상태
//    var nowIndex; // 바뀐 상태
    var pageBlock = $(this).closest('[data-role="page"]') ;
    var pageBlock_name = pageBlock.attr('data-page') ;
    var contentBlock = $(this).closest('[data-role="page"]').find('[data-role="body"] > [data-role="content"]:visible') ;
    //var contentBlock = $(this).closest('[data-role]:not([data-role="content"])');
    //var contentBlock = $(this).closest('[data-role="content"]');
    if( this.id.indexOf('SYS-') < 0 ){
        return;
    }
    get_info = get_Ele_info( 'id', this.id) ;
    //console.log('e.type 1 : ' + this.id + ', ' + get_info.type + ', ' + get_info.name) ;
    if(get_info.type == 'sel'){
//        var nowIndex = this.value.split(',')[0];
        var nowIndex = document.getElementById(this.id).selectedIndex;
        var obj = cur_Evnts[get_info.type][get_info.name].Request ;
        if( OFUNC.has_function(obj) ) obj.call(this, e, contentBlock, nowIndex) ;
    }
}

/**
* Event Binding
* @param arg [ {'pageBlock' : 페이지블럭 ID명, 'Role' : data-role의 값},  {'pageBlock' : 페이지블럭 ID명, 'Role' : data-role의 값} ..... ]
*/
var Event_bind = function( page, arg ){

  	//console.log('Event_bind page length : ', $(page).length, arg) ;

    if(! $(page).length) {
    	//console.log('Event_bind Faild : ', page) ;
    }

    var block = $(page) ;

    if(block.data('role') != 'page'){
		block = block.closest('[data-role="page"]').not(block) ;
	}

    block
        .find('[id^="SYS-BTN-"], [class*="SYS-BTN-"], [id^="SYS-INPUT-"], [class*="SYS-INPUT-"]').not('.SYS-INPUT-CHECK')
            .unbind('mousedown touchstart MozTouchDown')
                .bind('mousedown touchstart MozTouchDown', btn_handler) ;

    block
        .find('.SYS-BTN-POS, .SYS-BTN-KEY_MINUS, .SYS-BTN-KEY_PLUS, .SYS-BTN-KEY_MINUS_EX, .SYS-BTN-KEY_PLUS_EX').not('.SYS-disable')//.not('.SYS-BTN-POS_LEVEL')
            .unbind('mouseup touchend MozTouchUp')
                .bind('mouseup touchend MozTouchUp', btn_handler) ;

    block.find('.SYS-INPUT-CHECK').unbind('click').bind('click', btn_handler) ;
    block.find('[id^="SYS-SEL-"]').unbind('change').bind('change', sel_changer) ;
};

var remove_EvntObj = function(Evnt, add_evnt,all){
    for(var i in add_evnt){
        if(all) for(var j in add_evnt[i]) delete Evnt[i][j];
        else{
            if(i=='btn' || i=='input'){
                for(var j in add_evnt[i]) delete Evnt[i][j];
            }
        }
    }
    return Evnt ;
}

var Event_unbind = function( page, arg ){
    if(! page.length) {
    	//console.log('Event_unbind Faild : ', page) ;
    }

    var block = $(page) ;

    if(block.data('role') != 'page'){
        block = block.closest('[data-role="page"]').not(block) ;
    }

    block
    	.find('[id^="SYS-BTN-"], [class*="SYS-BTN-"], [id^="SYS-INPUT-"], [class*="SYS-INPUT-"]')
    		.unbind('mousedown touchstart MozTouchDown') ;

	block
    	.find('.SYS-BTN-POS, .SYS-BTN-KEY_MINUS, .SYS-BTN-KEY_PLUS, .SYS-BTN-KEY_MINUS_EX, .SYS-BTN-KEY_PLUS_EX')
    		.unbind('mouseup touchend MozTouchUp') ;

    block.find('.SYS-INPUT-CHECK').unbind('click') ;
}

/**
* CSS 변경
* @param String _newCss 변경 CSS이름
*/
var Css_Change = function (_nameCss) {
    //<link href="../css/style.css" rel="stylesheet">
    //document.querySelector('link[href="../css/style.css"]').add();
    //var run = 'link[href="../css/' + _nameCss + '"]';
    //console.log('Css_Change : ' + _nameCss + ' : ' + run);
    $('link[title="maru"]').attr('href', MY_PATH + 'form/css/' + _nameCss);
    //$('link[href="../css/' + _newCss + '"]').add();//$('link[href="../css/style.css'"]').add()document.querySelector('link[href="../css/style.css"]').remove()
};

/**
* CSS 삭제, 추가
* @param String _param 0:삭제, 1:추가
* @param String _nameCss 삭제 또는 추가 CSS이름
*/
var Css_DelOrAdd = function (_param, _nameCss) {
    //<link href="../css/style.css" rel="stylesheet">
    //document.querySelector('link[href="../css/style.css"]').add();
    //var run = 'link[href="file://' + MY_PATH + 'form/css/' + _nameCss + '"]';
    var run = 'link[href="../css/' + _nameCss + '"]';
    console.log('Css_Change : ' + run + ' / ' + _param);
    if (_param == '1')
        $('head').find(run).add();
    else {
        console.log('Css_Change remove : ' + $('head').find(run));
        $('head').find(run).remove();
    }
};

/**
* 레벨 표시 변경
* @param String id (SYS-CHANGE-LEVEL이면 "LEVEL")
* @param integer level 레벨단계
*/
var Level_Change = function(id, level){
    var ele = id ; //$('#SYS-BTN-'+id.toUpperCase()) ;
    if( ele.length ){
        ele.removeClass('level-1 level-2 level-3 level-4 level-5')
            .addClass('level-'+level) ;
    }
};

/**
* Img 변경
* @param String id (SYS-BTN-XXXX, fine 'img')
* @param 이미지 이름과 경로
*/
var Icon_Change = function(nBtn, name){
    //console.log('name' + nBtn + ', ' + name);
    var time = new Date().getTime();
    $('#SYS-BTN-ORDER' + nBtn).find('img').attr({'src':'/storage/emulated/0/Download/REORDER/pack' + name +'.png?time='+time});
};

/**
* 텍스트 출력 & 가져오기
*
* @param method GET(가져오기), PUT(출력)
* @param json 예제) { 'TIME1' : '09:52:34', 'TIME2' : '07:52:34', 'TXT-1' : 789 }
*/
var Text_put = function(json){
    //console.log('Text_put : ' + json) ;
    var Vars = null ;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
        console.log('Text_put Func not json.') ;
    	return ;
    }
    for (var i in Vars) {
        var ele = $('#SYS-TXT-' + i.toUpperCase()); 
        if (!ele.length)
            ele = $('.SYS-TXT-' + i.toUpperCase());

        if (ele.length) {
            if (ele.is("input"))
                ele.val(Vars[i]);
            else
                ele.html(Vars[i]); // ele.text( Vars[i] );
        } else
            console.log('PUT Not Found -> .SYS-TXT-' + i.toUpperCase());
    }
};

//_name : id or class name
var Text_get = function (_name) {  
    //console.log('Text_get ' + _name);
    var UpperName = _name.toUpperCase();
    var data;
    var ele = $('#SYS-TXT-' + UpperName); 
    if (!ele.length) {
        ele = $('.SYS-TXT-' + UpperName);
        //console.log('.SYS-TXT-' + UpperName + ' : ' + data);
    }
    if (ele.length) {
        if (ele.is("input"))
            data = ele.val();
        else
            data = ele.text();
    } else {
        console.log('GET Not Found -> #' + i.toUpperCase());
    }
    //console.log('#SYS-TXT-' + UpperName + ' : ' + data);

    return data;
}

var Text_Group = function(name, json){

    var Vars = null ;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
    	console.log('Text_multi_Speed Func not json.') ;
    	return ;
    }
    for(var i in Vars)
    {
        //---------------------------------------
        var ele = $('.'+name + '_' + i) ;
        //console.log('Text_Group -> ' + name + '_' + i);
        if(ele.length)
            ele.html( Vars[i] );
        else
            console.log('Not Found -> '+ name + '_' + i) ;
    }
};

var Text_Group = function(name, json, _radix){

    var Vars = null ;
    var radix = 10;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
    	console.log('Text_multi_Speed Func not json.') ;
    	return ;
    }
    if(_radix != null)
        radix = parseInt(_radix);
    //console.log('Text_Group -> ' + name + ',' + json + ', '+ radix);
    var nNum = 0;
    var sNum;
    var mStack = new Array(3);
    var mCnt = -1;
    var DIGIT = '0123456789ABCDEFGHIJ';
    var ele;
    for(var i in Vars)
    {
        //---------------------------------------
        nNum = parseInt(i);
        if(radix == 10 || nNum < radix){
            ele = $('.'+name + '_' + i) ;
            sNum = i.toString();
            //console.log('Text_Group 1-> ' + name + '_' + sNum);
        }else{
            mCnt = -1;
            while(parseInt(nNum / radix) > 0 && mCnt < 3){
                mStack[++mCnt] = parseInt(nNum % radix);
                nNum = parseInt(nNum / radix);
            }
            if(nNum != 0)
                mStack[++mCnt] = nNum;
            sNum = '';
            for(var j = mCnt; j >= 0; j--){
                sNum += DIGIT[mStack[j]];
            }
            ele = $('.'+name + '_' + sNum) ;
            //console.log('Text_Group 2-> ' + name + '_' + sNum + " : " + Vars[i]);
        }
        if(ele.length)
            ele.html( Vars[i] );
        else
            console.log('Not Found -> '+ name + '_' + sNum) ;
    }
};

var Text_multi_Speed = function(json){

    var Vars = null ;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
    	console.log('Text_multi_Speed Func not json.') ;
    	return ;
    }
    for(var i in Vars)
    {
        //---------------------------------------
        var ele = $('.SYS-TXT-'+i.toUpperCase()) ;
        //if(ele.length) ele.text( Vars[i] );
        if(ele.length) ele.html( Vars[i] );
        else console.log('PUT Not Found -> .SYS-TXT-'+i.toUpperCase()) ;
    }
};

var text_string_array = function (_name, _num, _str) {
    var Vars = null;
    if (_str) {
        Vars = _str.split('@');
    }
    if (!Vars) {
        console.log('text_string_array Func not string.');
        return;
    }

    console.log('text_string_array -> ' + _str);
    var Ele = $('.' + _name + '_0', $(document.body));
    if (Ele.length)
        Ele.html('' + (parseInt(_num) + 1));
    for (var i = 0; i < Vars.length; i++) {
        //---------------------------------------
        Ele = $('.' + _name + '_' + (i+1), $(document.body));
        //if(ele.length) ele.text( Vars[i] );
        if (Ele.length)
            Ele.html(Vars[i]);
        console.log('text_string_array -> ' + '.' + _name + '_' + i + ' / ' + Vars[i]);
    }
};

var edit_append = function (_id, _str) {
    var Vars = null;
    if (!_str) {
        return;
    }
    //console.log('text_string -> ' + _str);
    var mStr = _str.replace('<br />', '\r\n');
    //var Ele = $('.' + _name + '_0', $(document.body));
    var Ele = $('#' + _id);
    Ele.text(Ele.val() + mStr);
};

/**
* document 리스트 출력
*
* @param string jsonStr ( json string )
* @param string id  ( contentID  html의 <div data-role="content" id="contentID 명"> )
*/
var Put_Document_list_bak = function(json, id){

    var datas = null ;
    if(json){
        datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('Put_Document_list Func not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('Put_Document_list Func - no data.') ;
        return ;
    }
    //var block = $('#SYS-PUT-LST_LEFT-doc_chain_select_ex') ;
    var Block = $('#'+id) ;

    if( ! Block.length ){
        console.log('Put_Document_list Func - id : '+id + ' Not Found') ;
        return ;
    }

    var Block_Body_left = Block.find('table#SYS-PUT-LST_LEFT') ; //.children('tbody') ;
    var Block_Body_right = Block.find('table#SYS-PUT-LST_RIGHT') ; //.children('tbody') ;
    Block_Body_left.children('tbody').empty() ;
    Block_Body_right.children('tbody').empty() ;

    var Clone_tr = null ;
    var data = null ;
    var Put_block = null ;
    for(var i=0,l=datas.length; i < l; i++)
    {
        data = datas[i] ;
        if( i < 6 ){
            Clone_tr = Block_Body_left.find('tfoot > tr').clone(true) ;
            Put_block = Block_Body_left.children('tbody') ;
        }else{
            Clone_tr = Block_Body_right.find('tfoot > tr').clone(true) ;
            Put_block = Block_Body_right.children('tbody') ;
        }

        Clone_tr.find('input[type="checkbox"]').prop({'id': 'cb-' + id.trim() + '-' + i.toString().trim(), 'data-name':data.name}).attr('data-name', data.name).val(data.no) ;
        Clone_tr.find('label').prop('for', 'cb-'+ id.trim() + '-' + i.toString()) ;
        Clone_tr.find('.SYS-TEXT-DATA_NO').text(data.no) ;
        Clone_tr.find('.SYS-TEXT-DATA_NAME').text(data.name) ;

        Put_block.append(Clone_tr) ;
    }
};

var Put_Anchor = function (id, json) {
    //console.log('Put_Anchor : ' + id + ", " + json);
    var datas = null;
    var Block = $('#' + id);
    var removeAnchor = Block.find('.SYS-BTN-ANCHOR').not('.SYS-BTN-ANCHOR[data-name*="copy"]');
    for (var r of removeAnchor) {
        r.remove();
    }

    if (json == 'null') {
        return;
    } else if (json) {
        datas = JSON.parse(json);
    }
    if (!datas) {
        console.log('Anchor_put Func not json.');
        return;
    }
    if (!datas.length) {
        console.log('Anchor_put Func - no data(size 0).');
        return;
    }

    var data = null;
    //var Anchor_idx = 0;
    var addImage = '<img src="' + MY_PATH + 'form/source/menu_add.svg">';
    var OriAnchor = Block.find('.SYS-BTN-ANCHOR[data-name*="copy"]');

    data = datas[0];
    var Navi = $('#' + data[3]).find('.navigation');
    Navi.find('.dot').children().remove();
    for (var j = 0; j < data[1]; j++) {
        if (j == data[2]) //j가 현재 page와 같은 값이면
        {
            Navi.find('.dot').append('<li class="active"></li>');
        } else {
            Navi.find('.dot').append('<li></li>');
        }
    }

    var len = datas.length ;
    len = ((data[0]+1) >= len) ? len : (data[0]+1);
    console.log('end :' + len + ', ' + data[0] + ', ' + datas.length);
    for (var i = 1; i < len; i++) {
        data = datas[i];
        var clone = OriAnchor.clone(true);
        //console.log('anchor : ' + i + ', ' + data[4]);
        //clone.css('display', 'block');
        clone.removeAttr('style');
        clone.attr('data-name', data[0]);
        clone.append($('<img src="' + MY_PATH + 'img_goods/' + data[4] + '"><h3>' + data[1] + '</h3><div class="price">' +
            '<p>' + data[2] + '</p>' +  ((data[3] == '1') ? addImage : '') + '</div>'));
        Block.append(clone);
    }
    //console.log('Put_Anchor End');
}

var Put_Select_Goods = function (id, json) {
    //console.log('Put_Anchor : ' + id + ', ' + json);
    var isReturn = false;
    var datas = null;
    var Block = $('#' + id);
    var removeList = Block.find('.SYS-ORDER-LIST').not('.SYS-ORDER-LIST[data-name*="copy"]');
    for (var r of removeList) {
        r.remove();
    }
    if (json == '' || json == 'null') {
        isReturn = true;
    } else if (json) {
        datas = JSON.parse(json);
    }
    if (!isReturn && !datas) {
        console.log('Anchor_put Func not json.');
        isReturn = true;
    }
    if (!isReturn && !datas.length) {
        console.log('Anchor_put Func - no data(size 0).');
        isReturn = true;
    }
    if (isReturn) {
        $('#goods_pay').find('.count').text('0');
        $('#goods_pay').find('.price').text('0');
        return;
    }

    //Block.prop('style').css('bottom', '0px');
    var data = null;
    var len = datas.length;
    var List_idx = 0;
    var OriList = Block.find('.SYS-ORDER-LIST');

    //data = datas[0];
    //for (var prop in data) {
    //    console.log(prop + ',' + data[prop]);
    //}
    var i = 0;
    for (; i < (len-1); i++) {
        data = datas[i];
        var clone = OriList.clone(true);
        clone.removeAttr('style');
        clone.removeAttr('data-name');
        clone.find('.num').text(data[0]);
        clone.find('.name').text(data[1]);
        if (data[2] != '1') {
            clone.find('.shot').remove();
        }
        clone.find('.countNum').text(data[3]);
        clone.find('.price').text(parseInt(data[4]).toLocaleString('ko-KR'));
        clone.find('.SYS-BTN-G_MINUS').attr('data-name', data[0] - 1).attr('src', MY_PATH + 'form/source/price_minus.svg');
        clone.find('.SYS-BTN-G_PLUS').attr('data-name', data[0] - 1).attr('src', MY_PATH + 'form/source/price_plus.svg');
        clone.find('.SYS-BTN-G_ERASER').attr('data-name', data[0] - 1).attr('src', MY_PATH + 'form/source/price_remove.svg');
        Block.append(clone);
        List_idx++;
    }
    data = datas[i];
    $('#goods_pay').find('.count').text(data['count']);
    $('#goods_pay').find('.price').text(parseInt(data['price']).toLocaleString('ko-KR'));
}

var Put_CoffeeAnchor = function (id, _aDatas) {
    //console.log('Put_CoffeeAnchor : ' + id + ", " + _aDatas);
    var Anchor = $('.SYS-ANCHOR-' + id);
    var removeItem = Anchor.find('.item').not('.item[data-name*="copy"]');
    for (var r of removeItem) {
        r.remove();
    }

    if (!_aDatas.length) {
        return;
    }
    var aMenu = _aDatas.split(':');
    Anchor.find('.result').find('span').text(aMenu.length);

    var data = null;
    var OriItem = Anchor.find('.item[data-name*="copy"]');
    console.log('end :' + OriItem.length);
    if (OriItem.length) {
        for (var i = 0; i < aMenu.length; i++) {
            data = aMenu[i].split(',');
            var clone = OriItem.clone(true);
            clone.removeAttr('style').removeAttr('data-name');
            clone.find('.delete').attr('data-name', data[0]);
            clone.find('.edit').attr('data-name', data[0]);
            clone.find('.name').text(data[1]);
            clone.find('.price').html(data[2] + '원<p>(point : ' + data[6] + 'P)</p> ');
            clone.find('.img').find('img').attr('src', MY_PATH + 'img_goods/' + data[4]);//price
            if (data[3] == '0') {
                clone.find('.shot').find('i').removeClass('active').addClass('deactive');
            } else {
                clone.find('.shot').find('i').removeClass('deactive').addClass('active');
            }
            clone.find('.shot').find('.coffee').text((parseInt(data[10]) + parseInt(data[11])));
            clone.find('.shot').find('.milk').text(data[12]);

            Anchor.append(clone);
        }
    }
    //console.log('Put_Anchor End');
}

var Put_RefundAnchor = function (id, _aDatas) {
    //console.log('Put_RefundAnchor : ' + id + ", " + _aDatas);
    var Anchor = $('.SYS-ANCHOR-' + id);

    var removeItem = Anchor.find('.item').not('.item[data-name*="copy"]');
    for (var r of removeItem) {
        r.remove();
    }

    if (!_aDatas.length) {
        return;
    }
    var aMenu = _aDatas.split(':');
    var data = null;
    var OriItem = Anchor.find('.item[data-name*="copy"]');
    //console.log('end :' + OriItem.length);

    if (OriItem.length) {
        for (var i = 0; i < aMenu.length; i++) {
            data = aMenu[i].split(',');
            var clone = OriItem.clone(true);
            clone.removeAttr('style').removeAttr('data-name');
            //clone.attr('data-name', data[0]);
            clone.find('.num').text(data[0]);
            clone.find('.date').text(data[1]);
            clone.find('.price').text(data[2]);
            clone.find('.bt').attr('data-name', data[0]);

            Anchor.append(clone);
        }
    }
    //console.log('Put_Anchor End');
}

var Put_Document_list = function(json, id){
    var datas = null ;
    if(json){
        datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('Put_Document_list Func not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('Put_Document_list Func - no data.') ;
        return ;
    }
    //var block = $('#SYS-PUT-LST_LEFT-doc_chain_select_ex') ;
    var Block = $('#'+id) ;

    if( ! Block.length ){
        console.log('Put_Document_list Func - id : '+id + ' Not Found') ;
        return ;
    }

    // 초기화
    //for(var i=0,l=datas.length; i < l; i++)
    for(var i=1,l=4; i <= l; i++)
    {
        var Block_table = Block.find('table#SYS-PUT-LST-'+i) ; //.children('tbody') ;
        Block_table.children('tbody').empty() ;
    }

    var Clone_tr = null ;
    var data = null ;
    var Put_block = null ;

    var Table_idx = 0;
    var Block_table = null ;

    for(var i=0,l=datas.length; i < l; i++)
    {
        data = datas[i] ;

        if( i%6==0 )
        {
            Table_idx++ ;
            Block_table = Block.find('table#SYS-PUT-LST-'+Table_idx) ; //.children('tbody') ;
        }

        Clone_tr = Block_table.find('tfoot > tr').clone(true) ;
        Put_block = Block_table.children('tbody') ;

        Clone_tr.find('input[type="checkbox"]').prop({'id': 'cb-' + id.trim() + '-' + i.toString().trim(), 'data-name':data.name}).attr('data-name', data.name).val(data.no) ;
        Clone_tr.find('label').prop('for', 'cb-'+ id.trim() + '-' + i.toString()) ;
        Clone_tr.find('.SYS-TEXT-DATA_NO').text(data.no) ;
        Clone_tr.find('.SYS-TEXT-DATA_NAME').text(data.name) ;

        Put_block.append(Clone_tr) ;
    }
};
/**
* document 리스트에서 체크박스 선택한 값 가져오기
*
* @param string id  ( contentID  html의 <div data-role="content" id="contentID 명"> )
* @return string json
*/
var Get_Document_list = function(id){

    var Block = $('#'+id) ;
    if( ! Block.length ){
        console.log('Get_Document_list Func - id : '+id + ' Not Found') ;
        return ;
    }
    var CheckBox = $('tbody .SYS-INPUT-CHECKBOX', Block) ;

    var chk_datas = [];
    for(var i=0,l=CheckBox.length; i < l; i++){
        if(CheckBox.eq(i).is(':checked')) chk_datas.push( { 'no':CheckBox.eq(i).val(), 'name' : CheckBox.eq(i).attr('data-name') } ) ;
    }
    return JSON.stringify(chk_datas) ;
};
/**
* 리스트 출력하기
*
* @param string json ( json string )
* @param string id  ( contentID  html의 <div data-role="content" id="contentID 명"> )
* @return void
*
* @access json의 Key명[소문자] 과 퍼블리싱(SYS-TEXT-DATA_키명[대문자])을 일치시키면 해당 N개의 Key 만큼 열(Column)을 출력함.
*
* @example
*   예제(json string) -> "[{"no":값,"date":값,"time":값, ....},{"no":값,"date":값,"time":값, ...} .....]

    퍼블리싱 아래참조
    <table id="SYS-PUT-LST"...>
        <tbody></tbody>
        <tfoot class="hide">
            <tr>
              <td class="SYS-TEXT-DATA_NO"></td>    <-- json key : no
              <td class="SYS-TEXT-DATA_DATE"></td>  <-- json key : date
              <td class="SYS-TEXT-DATA_TIME"></td>  <-- djson key : time
              ....
              ....
            </tr>
        </tfoot>
    </table>
*/
var Put_list = function(json, id){
    var datas = null ;
    if(json){
        datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('Put_list Func not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('Put_list Func - no data.') ;
        return ;
    }
    var Block = $('#'+id) ;
    if( ! Block.length ){
        console.log('Put_list Func - id : '+id + ' Not Found') ;
        return ;
    }

    var Block_Body = Block.find('table#SYS-PUT-LST') ; //.children('tbody') ;
    Block_Body.children('tbody').empty() ;

    var Clone_tr = null ;
    var data = null ;
    var Put_block = null ;


    var Fields = [] ;

    Block_Body.find('tfoot').find('[class*="SYS-TEXT-DATA_"]').each(function(){
    	//console.log( "SYS-TEXT-DATA_".match (/(^|\s)f-\S+/g) ) ;
        Fields.push(
            this.className.match( /(SYS-TEXT-DATA_)(.*?)(?:\s|$)/g )[0]
                .replace('SYS-TEXT-DATA_','')
                    //.toLowerCase()
        ) ;
    });

    for(var i=0,l=datas.length; i < l; i++)
    {
        data = datas[i] ;
        Clone_tr = Block_Body.find('tfoot > tr').clone(true) ;
        Put_block = Block_Body.children('tbody') ;

        for(var j=0,k=Fields.length; j<k; j++)
        {
            Clone_tr.find('.SYS-TEXT-DATA_'+Fields[j]).text( data[Fields[j].toLowerCase()] ) ;
        }
        /*Clone_tr.find('.SYS-TEXT-DATA_NO').text(data.no) ;
        Clone_tr.find('.SYS-TEXT-DATA_DATE').text(data.date) ;
        Clone_tr.find('.SYS-TEXT-DATA_TIME').text(data.time) ;*/
        Put_block.append(Clone_tr) ;
    }
};

/**
* document 리스트에서 체크박스 체크하기/해제하기
*
* @param string json   예제-> "[{"no":"001","active":true},{"no":"002","active":false}.....]
* @param string id  ( contentID  html의 <div data-role="content" id="contentID 명"> )
* @param string Target (기본값: 'CHECKBOX') / 설명: SYS-INPUT-Target명 ( <input type="checkbox" class="SYS-INPUT-Target명"> )
* @return void
*
* @desc json의 object의 키( no:값, active : [true:활성화 or false:비활성화] )
*/
var checkbox_Activate = function(json, id, Target){

    if(typeof Target == 'undefined') Target = "CHECKBOX" ;

    var datas = null ;
    if(json){
        datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('checkbox_Activate Func - not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('checkbox_Activate Func - no data.') ;
        return ;
    }
    var data = null ;
    var Block = $('#'+id) ;
    if( ! Block.length ){
        console.log('checkbox_Activate Func - id : '+id + ' Not Found') ;
        return ;
    }
    if( ! $('.SYS-INPUT-'+Target, Block).length ){
        console.log('checkbox_Activate Func - Target : SYS-INPUT-'+Target + ' Not Found') ;
        return ;
    }
    for(var i=0,l=datas.length; i < l; i++)
    {
        data = datas[i] ;
        $('.SYS-INPUT-'+Target+'[value="'+data.no+'"]').prop('checked', data.active) ;
    }
};

/**
* 버튼액션 - 활성화(active) / 비활성화(deactive)
*
* @param contentID  html의 <div data-role="content" id="contentID 명">
* @param type 버튼은 "BTN"
* @param json
* @example action_Activate('design_stitch_o','BTN',{'PRESS_FEED':'active', 'CIRCLE_TG:1':'active', 'LINE_ZIGZIG:2': 'active'});
* @desc
        :: json의 키(KEY) 선언방법

            [스타일 1 : class선언] - 동일한 클래스명이 N개일경우
                코드(html)
                    활성화 <div class="SYS-BTN-LINE_ZIGZIG...."> ... </div>
                    비활성화 <div class="SYS-BTN-LINE_ZIGZIG...."> ... </div>
                ...
                처리 :
                    {'LINE_ZIGZIG:배열인덱스번호' : 'active', ....

            [스타일 2 : id선언] - id 일 경우(1개)
                코드(html)
                    활성화 <div id="SYS-BTN-PRESS_FEED...."> ... </div>
                ...
                처리 :
                    {'PRESS_FEED' : 'active', ....
*
*/
var action_Activate = function (contentID, type, json) {
    //console.log('contentID is ' + contentID + ', type:' + type + ', json:' + json + ", " + document.body);
    var Vars = null ;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
    	console.log('action_Activate Func not json.') ;
    	return ;
    }
    //console.log('contentID is '+contentID+', type' + type);

    var contentBlock = contentID ? $('#'+contentID) : $(document.body);
    if( ! contentBlock.length ){
        //console.log('contentID is '+contentID+' Not Found');
        //return ;
        contentBlock = $(document.body) ;
    }
    type = type.toUpperCase();
    for(var i in Vars)
    {
        var Ele = null ;

        if(type == 'BTN')
        {
            if(i.indexOf(':') < 0)
            {
                Ele = $('#SYS-BTN-'+i, contentBlock) ;
                if (!Ele.length) {
                    Ele = $('.SYS-BTN-' + i, contentBlock);
                }
                if (Ele.length) {
                    if (Vars[i] == 'active') Ele.addClass('active').removeClass('deactive');
                    else if (Vars[i] == 'deactive') Ele.addClass('deactive').removeClass('active');
                } 
            }
            else if(i.indexOf(':') >= 0){
                var part = i.split(':') ;
                var ele_name = part[0] ; // 이름
                var ele_index = parseInt(part[1]) ; // 배열 index 번호
                var ele_Selector = '.SYS-BTN-'+ele_name ;
                //console.log('action_Activate2', i,ele_name, ele_index);

                Ele = $(ele_Selector, contentBlock) ;
                if( Ele.length )
                {
                    $(ele_Selector, contentBlock).not( $(ele_Selector+':eq('+ele_index+')', contentBlock) ).addClass('deactive').removeClass('active');

                    if(Vars[i] == 'active')
                    {
                        $(ele_Selector+':eq('+ele_index+')', contentBlock).addClass('active').removeClass('deactive');
                    }
                    else if(Vars[i] == 'deactive') {

                        $(ele_Selector+':eq('+ele_index+')', contentBlock).addClass('deactive').removeClass('active');
                    }
                }
            }
        }else if(type == 'INPUT' || i.indexOf(type) >= 0){
            var ele_Selector = '#' + i;
//            var part = i.split(':') ;
//            var ele_name = part[0] ;
//            var ele_Selector = '.SYS-INPUT-'+ele_name ;
            //console.log('action_active : ' + contentID + ", " + type + ", " + i + ":" + Vars[i] + ", " + document.body + ", " + contentBlock);
            if(Vars[i] == 'active'){
                $(ele_Selector, contentBlock).addClass('active').removeClass('deactive');
            }else if(Vars[i] == 'deactive') {
                $(ele_Selector, contentBlock).addClass('deactive').removeClass('active');
            }
        }
    }
};

/* 버튼 또는 셀의 그룸의 색깔을 한거번에 제어
** _groupID : 공통 ID, 예) GROUP-TD-01
** _select : -1 -> 선택안함, 0 -> 전체선택, 1이상 -> 하나 선택
** _num : 그룹의 크기
*/
var Group_Select = function(_groupID, _select, _num, _color){
    var contentBlock = $(document.body);
    //console.log('contentID is xxx : ' + _groupID + ", " + _select + ", " + _color);
    var color;
    if(_color == 'null'){
        color = 'red';
    }else{
        color = _color;
    }
    var Ele;
    if(_select == 0 && _num > 1){
        //console.log('GROUP_ID is k.' + _color);
        for(var i=1; i <= _num; i++){
            //console.log('GROUP_ID is .'+_groupID+"_"+i + ", " + color);
            Ele = $('.'+_groupID+"_"+i) ;
            Ele.attr('style', 'background-color:' + color);
            Ele.addClass('active').removeClass('deactive') ;
        }
    }else if(_select > 0 && _num < 0){
        Ele = $('.'+_groupID + "_" + _select) ;
        Ele.addClass('deactive').removeClass('active') ;
    }else{
        //console.log('GROUP_ID is y.' + _color + ', ' + _select + ', ' + _num);
        for(var i=1; i <= _num; i++){
            Ele = $('.'+_groupID + "_" + i) ;
//            if(_color != 'null'){
//                Ele.attr('style', 'background-color:' + color);
//            }else{
//                Ele.attr('style', 'background-color:black');
//            }
            if(_select < 0){
                Ele.removeAttr('style');
                Ele.addClass('deactive').removeClass('active') ;
            }else{
                if( i == _select ){
                    Ele.addClass('active').removeClass('deactive') ;
                }else{
                    Ele.addClass('deactive').removeClass('active') ;
                }
            }
        }
    }
};

/* 버튼 또는 셀의 그룸의 색깔을 한거번에 제어
** _groupID : 공통 ID, 예) GROUP-TD-xx
** _select : 0 -> 선택안함, 2 -> 전체선택, 1이상 -> 각각 선택
** _data : _sel -> 1 일때 bit값, _sel -> 2일때
** -size : 인덱스 부분 포함 크기
*/
var Table_Line = function (_groupID, _kind, _cell, _line_size, _color) {
    var contentBlock = $(document.body);
    //console.log('contentID is xxx : ' + _groupID + ", " + _kind + ", " + _cell + ", " + _line_size + ", " + _color);
    var color;
    if (_color == 'null') {
        color = 'red';
    } else {
        color = _color;
    }
    var Ele;
    if (_kind == 0) {
        for (var i = 0; i < _line_size; i++) {
            Ele = $('.' + _groupID + "_" + i);
            Ele.removeAttr('style');
            Ele.addClass('deactive').removeClass('active');
        }
    } else if (_kind == 2) {
        for (var i = 0; i < _line_size; i++) {
            Ele = $('.' + _groupID + "_" + i);
            Ele.attr('style', 'background-color:' + color);
            Ele.addClass('active').removeClass('deactive');
        }
    } else if (_kind == 1) {
        for (var i = 0; i < _line_size; i++) {
            Ele = $('.' + _groupID + "_" + i);
            if ((_cell & (0x01 << i)) == 0) {
                Ele.removeAttr('style');
                Ele.addClass('deactive').removeClass('active');
            } else {
                Ele.attr('style', 'background-color:' + color);
                Ele.addClass('active').removeClass('deactive');
            }
        }
    }
};

/**
  error dialog On, Off
**/
var showErrorDlg = function(_isShow){
    if(_isShow){
        Error.dialogBox('show', 'wide', '', false, 'Data has been modified.\nPress OK key to confirm.\nYou can cancel this operation by press the Back key.', 'red');
        //Error.dialogBox('show', 'message', '', false, 'Data has been modified.\nPress OK key to confirm.\nYou can cancel this operation by press the Back key.', 'red');
    }else{
        Error.dialogBox('hide') ;
    }
}
var showErrorDlg = function(_isShow, _sMessage){
    if(_isShow){
        Error.dialogBox('show', 'wide', '', false, _sMessage, 'black');
        //Error.dialogBox('show', 'message', '', false, 'Data has been modified.\nPress OK key to confirm.\nYou can cancel this operation by press the Back key.', 'red');
    }else{
        Error.dialogBox('hide') ;
    }
}
/**
  select_red id, page name, On/Off
**/
var select_red = function(_btnID, _pageName, _isAct){
    if(_isAct){
        $('#SYS-BTN-'+_btnID,$('#'+_pageName)).css({'border':'3px solid red', 'box-sizing':'border-box'});
    }else{
        $('#SYS-BTN-'+_btnID,$('#'+_pageName)).css({'border':'0px', 'box-sizing':'border-box'});
    }
}

/**
* 해당 엘리먼트 class 추가 or 삭제
*
* @param string target_id ( 엘리먼트 ID명 )
* @param string json 클래스 설정
* @resource json
       {
        'add' : '클래스명 클래스명....'
        'remove' : '클래스명 클래스명....'
       }
*
* @example set_class_element('SYS-BTN-XSCALE', {'add' : 'active red', 'remove' : 'deactive white' }) ;
* @example set_class_element('SYS-BTN-YSCALE', {'add' : 'deactive', 'remove' : 'active' }) ;
* @example set_class_element('SYS-BTN-XSCALE', {'add' : 'active'}) ;
* @example set_class_element('SYS-BTN-XSCALE', {'remove' : 'active'}) ;
*/
var set_class_element = function(target_id, json){
    var Vars = null ;
    if(json){
        Vars = JSON.parse(json);
    }
    if( !Vars ) {
    	console.log('set_class_element Func not json.') ;
    	return ;
    }

    if(target_id) {
        if( $('#' + target_id).length ) {
            var target_ele = $('#' + target_id) ;

            if(typeof Vars.add !== undefined ) target_ele.addClass(Vars.add) ;
            if(typeof Vars.remove !== undefined ) target_ele.removeClass(Vars.remove) ;
        }
    }
};
var page_JsCss_event = function( kind, page_name, contentID ){
    //console.log('page_JsCss_event', kind, page_name, contentID);
//console.log('pppp');
    if( !contentID) return ;

	_jscss_load( kind, 'form/marujs/' + page_name + '/WebApp_' + contentID + '.js');
    //_jscss_load( kind, baseURL+'js/WebApp/' + page_name + '/WebApp_' + contentID + '.js');

    if(kind == "load") {
        Event_bind('#'+page_name, [{'Role': 'body', 'contentBlock' : contentID}] );
    }
    else if(kind == "remove") {
        Event_unbind('#'+page_name, [{'Role': 'body', 'contentBlock' : contentID}] );
    }

}
/**
* js, css 파일 로드
*
* @param string kind  				"load" 또는 "remove"
* @param string page_name  	[data-role="page"][data-page=???값]
* @param string page_id 		[data-role="page"]의 id명
* @param string contentID		[data-role="body"] > [data-role="content"]의 id명
* @param object callback		콜백 function
* @param boolean only			공용함수 적용유무(아래 소스참고)
*/
var JsCss_event = function( kind, page_name, page_id, contentID, callback, only ){
    //console.log('page_JsCss_event : ' + kind + ', ' + page_name + ', ' + contentID + ', ' + only);
    //console.log('ooooo');
    if( !contentID) return ;

	//var front_path = OFUNC.url_depth(location.href, folder_without).path  ;
	var files = [];
	if(only) {
		files = [baseURL + 'marujs/' + page_name + '/WebApp_' + contentID + '.js'] ;
	}else{
		files = [
					baseURL + 'marujs/' + page_name + '/WebApp_' + page_name + '.js',
					baseURL + 'marujs/' + page_name + '/WebApp_' + contentID + '.js'
				];
	}

	_jscss_load( kind, files, callback);

    if(kind == "load") {
       Event_bind('#'+page_id, [{'Role': 'body', 'contentBlock' : contentID}] );
    }
    else if(kind == "remove") {
        Event_unbind('#'+page_id, [{'Role': 'body', 'contentBlock' : contentID}] );
    }
}

var displayBlock_action = function(page_name, targetEle, contentID, fileName, jscss_inc_file){
    //var Parent_Ele = targetEle.attr('data-role') ;

    if(targetEle)
    {
            //$('[data-role="main"]').children('[data-role="content"]').each(function(i,o){
            targetEle.children('[data-role="content"]').each(function(i,o){
                var ownerID = $(this).prop('id') ;

                if( ownerID == contentID ) {
                    $(this).show();//$('#'+data_id).show();
                    history.pushState({url : fileName, transition: 'page', title: contentID, pageUrl: fileName, role: contentID }, contentID, fileName);
                    exist = true ;
                    page_JsCss_event("load", page_name, ownerID) ;
                }
                else {
                    $(this).hide();
                    page_JsCss_event("remove", page_name, ownerID) ;
                }
            });
            return exist ;
    }
    else{
            var page_name = $('[data-role="page"]').attr('data-page') ;

            if( $('[data-role="body"]').find( $('[id*="_one"][data-role="content"]') ).length )
            {
                $('[data-role="body"]').children('[data-role="content"]').each(function(i,o){
                //targetEle.children().each(function(i,o){
                    var ownerID = $(this).prop('id') ;

                    if( ownerID.indexOf("_one") > -1 ) {
                        $(this).show();
                        page_JsCss_event("load", page_name, ownerID) ;
                    }
                    else {
                        $(this).hide();
                        page_JsCss_event("remove", page_name, ownerID) ;
                    }
                });
            }
    }

};
var pageAction_Start = function(data_id){
    /*try{
        Maru_design.pageLoaded() ;
    }catch(e){}
    if (typeof pageStart_add !== 'undefined') pageStart_add(data_id) ;*/
};

var exist = false ;

var pageLoad = function(targetEle, id, fileName, jscss_inc_file){
    ////console.log('pageLoad', id, targetEle) ;
    var thisEvnt = this ;
    var pageBlock = $(this).closest('[data-role="page"]') ;
    var pageBlock_name = pageBlock.attr('data-page') ;

    if( targetEle.length )
    {
        displayBlock_action(pageBlock_name, ...arguments) ;

        if(!exist)
        {
            //setTimeout(function(){
                $.get( fileName, function( data ) {

                    if(data)
                    {
                        $(targetEle).append(data);

                        var data_ele = $($.parseHTML(data)) ;
                        var content_id = data_ele.prop('id') ;

                        //Event_bind();
                        //pageStart_add = null;
                        page_JsCss_event("load", pageBlock_name, content_id) ;

                        history.pushState({url : fileName, transition: 'page', title: content_id, pageUrl: fileName, page: thisEvnt.Context, role: content_id }, content_id, fileName);
                    }
                });
            //},100);
        }
        else{
            exist = false ;
        }
    }
    else{
        //console.log( 'page load not exist Element: '+ targetEle) ;
    }
}

var tapped=false;
/**
* 더블클릭 & 한번클릭 이벤트 처리
* @param data (string json)
* @example
        doubleClick_event({
            'single' : function(){
                .....
            },
            'double' : function(){
                .....
            });
*/
function doubleClick_event(data){
    if(!tapped){ //if tap is not set, set up single tap
        tapped=setTimeout(function(){
            tapped=null;

            // 한번 클릭한 경우
            if(typeof data.single == "function") data.single();

        },300);   //wait 300ms then run single click code
    } else {    //tapped within 300ms of last tap. double tap
        clearTimeout(tapped); //stop single tap callback
        tapped=null;

        // 더블클릭 한경우
        if(typeof data.double == "function") data.double();
    }
}

/**
* 서진 리스트 출력
*
* @param string json  json데이타
* @param id 리스트출력영역(table)의 부모블럭 id명
*
* @uses 예제

		html파일

		<div id="SYS-BLOCK-handle" class="tbl-content"> <-- 부모블럭 id명(SYS-BLOCK-handle)
          <table cellpadding="0" cellspacing="0" border="0">
          	<tbody>.....</tbody>
          	<tfoot style="display:none;"> <-- 템플릿 : 여기에 루프로 돌릴 tr태그를 삽입
          	  <tr></tr>
          	  ....
          	  ....
          	</tfoot>

      실행 : list_put(jsong string값, 'SYS-BLOCK-handle') ;
*
*
*/

var list_put = function(json, id, _char){
    var datas = null ;
    if(json == 'null'){
        var Block = $('#'+id) ;
     	var Block_table = Block.find('table').eq(0) ;
        Block_table.children('tbody').empty() ;
        return;
    }else if(json){
      datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('list_handle_put Func not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('list_handle_put Func - no data.') ;
        return ;
    }
    var Block = $('#'+id) ;

    if( ! Block.length ){
        console.log('list_handle_put Func - id : '+id + ' Not Found') ;
        return ;
    }

    // 초기화
 	var Block_table = Block.find('table').eq(0) ;
    Block_table.children('tbody').empty() ;


    var Clone_tr = null ;
    //var JoneClone = [];
    var data = null ;
    var Put_block = null ;

    var Table_idx = 0;
	var columns_len = 0 ;

	Put_block = Block_table.children('tbody') ;

    for(var i=0,len=datas.length; i < len; i++)
    {
        //var AsAdd = [];
        data = datas[i] ;

		if(!columns_len){
			for(var j in data) columns_len++ ;
		}
		var sIndex = '' + i;
        if(sIndex.length == 1)
            sIndex = '000'+sIndex;
        else if((sIndex.length == 2))
            sIndex = '00' + sIndex;
        else if((sIndex.length == 3))
            sIndex = '0' + sIndex;
        if(_char != null && _char.length >= 1 && _char.length != ' ')
            sIndex = _char + sIndex;
        Clone_tr = Block_table.find('tfoot > tr').clone(true) ;
        Clone_tr.attr('style', 'background-color:black');
        Clone_tr.addClass('SYS-TXT-' + sIndex + '_TR');
        //AsAdd[0] = '<tr style="background-color:black" class="SYS-TXT-' + sIndex + '_TR">';
		var k=0;
        for(var l in data)
		{
        	Clone_tr.find('td').eq(k).prop({'id': 'TD-' + sIndex + "_" + l, 'data-value':data[l]}).attr({'id': 'TD-' + sIndex + "_" + l, 'data-value':data[l]}).html(data[l]) ;
        	Clone_tr.find('td').eq(k).prop({'id': 'TD-' + sIndex + "_" + l, 'data-value':data[l]}).addClass('SYS-TXT-' + sIndex + "_" + l);
        	k++ ;
        	//AsAdd[++k] = '<td class="SYS-BTN-CELL SYS-toggle deactive SYS-TXT-' + sIndex + '_' + l + '" id="TD-' + sIndex + '_' + l + '" data-value="' + data[l] + '">' + data[l] + '</td>';
        }
        //AsAdd[k+1] = '</tr>';
        Put_block.append(Clone_tr) ;
//        JoneClone[i] = AsAdd.join('');
//        if(i < 3)
//            console.log('Put_block : ' + JoneClone[i]);
        //Clone_tr = null;
    }
    //Put_block.append(JoneClone.join(''));
    //console.log('Put_block : ' + JoneClone.join(''));
    //Block[0].innerHTML = JoneClone.join('');
    //Put_block.innerHTML = JoneClone.join('');

    if( Block_table.children('tbody').find('tr').length )
    {
    	Block_table.children('tbody').find('tr td').bind('click',function(){
    		Block_table.children('tbody').find('tr td').removeClass('activated');
    		$(this).addClass('activated');
    	});
    }
};

var table_block_put = function (_id, _char) {
    var datas = null;
    if (json == 'null') {
        var Block = $('#' + id);
        var Block_table = Block.find('table').eq(0);
        Block_table.children('tbody').empty();
        return;
    } else if (json) {
        datas = JSON.parse(json);
    }
    if (!datas) {
        console.log('list_handle_put Func not json.');
        return;
    }
    if (!datas.length) {
        console.log('list_handle_put Func - no data.');
        return;
    }
    var Block = $('#' + id);

    if (!Block.length) {
        console.log('list_handle_put Func - id : ' + id + ' Not Found');
        return;
    }

    // 초기화
    var Block_table = Block.find('table').eq(0);
    Block_table.children('tbody').empty();


    var Clone_tr = null;
    //var JoneClone = [];
    var data = null;
    var Put_block = null;

    var Table_idx = 0;
    var columns_len = 0;

    Put_block = Block_table.children('tbody');

    for (var i = 0, len = datas.length; i < len; i++) {
        //var AsAdd = [];
        data = datas[i];

        if (!columns_len) {
            for (var j in data) columns_len++;
        }
        var sIndex = '' + i;
        if (sIndex.length == 1)
            sIndex = '000' + sIndex;
        else if ((sIndex.length == 2))
            sIndex = '00' + sIndex;
        else if ((sIndex.length == 3))
            sIndex = '0' + sIndex;
        if (_char != null && _char.length >= 1 && _char.length != ' ')
            sIndex = _char + sIndex;
        Clone_tr = Block_table.find('tfoot > tr').clone(true);
        Clone_tr.attr('style', 'background-color:black');
        Clone_tr.addClass('SYS-TXT-' + sIndex + '_TR');
        //AsAdd[0] = '<tr style="background-color:black" class="SYS-TXT-' + sIndex + '_TR">';
        var k = 0;
        for (var l in data) {
            Clone_tr.find('td').eq(k).prop({ 'id': 'TD-' + sIndex + "_" + l, 'data-value': data[l] }).attr({ 'id': 'TD-' + sIndex + "_" + l, 'data-value': data[l] }).html(data[l]);
            Clone_tr.find('td').eq(k).prop({ 'id': 'TD-' + sIndex + "_" + l, 'data-value': data[l] }).addClass('SYS-TXT-' + sIndex + "_" + l);
            k++;
            //AsAdd[++k] = '<td class="SYS-BTN-CELL SYS-toggle deactive SYS-TXT-' + sIndex + '_' + l + '" id="TD-' + sIndex + '_' + l + '" data-value="' + data[l] + '">' + data[l] + '</td>';
        }
        //AsAdd[k+1] = '</tr>';
        Put_block.append(Clone_tr);
        //        JoneClone[i] = AsAdd.join('');
        //        if(i < 3)
        //            console.log('Put_block : ' + JoneClone[i]);
        //Clone_tr = null;
    }
    //Put_block.append(JoneClone.join(''));
    //console.log('Put_block : ' + JoneClone.join(''));
    //Block[0].innerHTML = JoneClone.join('');
    //Put_block.innerHTML = JoneClone.join('');

    if (Block_table.children('tbody').find('tr').length) {
        Block_table.children('tbody').find('tr td').bind('click', function () {
            Block_table.children('tbody').find('tr td').removeClass('activated');
            $(this).addClass('activated');
        });
    }
};

var check_flist_put = function(json, id){
    var datas = null ;
    //console.log('check_flist_put : ' + id + ", " + json ) ;
    if(json){
        datas = JSON.parse(json);
    }
    if( !datas ) {
        console.log('list_handle_put Func not json.') ;
        return ;
    }
    if(!datas.length){
        console.log('list_handle_put Func - no data.') ;
        return ;
    }
    var Block = $('#'+id) ;

    if( ! Block.length ){
        console.log('list_handle_put Func - id : '+id + ' Not Found') ;
        return ;
    }

    // 초기화
 	var Block_table = Block.find('table').eq(0) ;
    Block_table.children('tbody').empty() ;

    //처음데이터에 ''(빈 데이터)가 들어 왔을 때 초기화만하고 리턴한다.
    if(datas[0].no == ''){
        return;
    }

    var Clone_tr = null ;
    var data = null ;
    var Put_block = null ;

    var Table_idx = 0;
	var columns_len = 0 ;
	var tempSplit = id.split('-');
	var subID = tempSplit[tempSplit.length-1];

	Put_block = Block_table.children('tbody') ;

    for(var i=0,len=datas.length; i < len; i++)
    {
        data = datas[i] ;
        Clone_tr = Block_table.find('tfoot > tr').clone(true) ;

//        Clone_tr.find('span').prop({'id': subID + '-' + data.no, 'data-name':data.name}).attr('data-name', data.name).val(data.no) ;
        Clone_tr.find('span').prop({'id': subID + '-' + data.no});
        Clone_tr.find('.txt').text(data.name) ;

        Put_block.append(Clone_tr) ;
    }
};


var drawImgFile = function (_img, _filename) {
    var fname = MY_PATH + 'img_goods/' + _filename;
    var UpperName = _img.toUpperCase();
    var Ele;
    if ($('#SYS-IMG-' + UpperName).length) {
        Ele = $('#SYS-IMG-' + UpperName);
    } else if ($('.SYS-IMG-' + UpperName).length) {
        Ele = $('.SYS-IMG-' + UpperName);
    } else if ($('.SYS-MODAL-' + UpperName).length) {
        Ele = $('.SYS-MODAL-' + UpperName);
    } else {
        return;
    }
    console.log('path : ' + fname);
    Ele.attr('src', fname);
}

//
var drawCanvasImg = function (_canvas_id, _filename) {
    var canvas = document.getElementById(_canvas_id);
    var ctx = canvas.getContext("2d");
    var img = new Image();
    var fname = '../../img_goods/' + _filename;
    img.src = fname;
    //console.log('path : ' + fname);
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log('path : ' + fname + ', ' + canvas.width + ', ' + canvas.height);
    }
}

var progress = function(_name, _json){
    var Vars = null ;
    //console.log('progress : ' + _json)
    if(_json){
        Vars = JSON.parse(_json);
    }
    if( !Vars ) {
        console.log('progress Func not json.') ;
        return ;
    }
    //var datas = {};
    for(var i in Vars)
    {
        var ele2 = $('.' + _name + "-P" + i) ;
        if(ele2.length){
            //ele2.attr('percent', Vars[i]);
            ele2.text( Vars[i] );
        }
        var ele1 = $('.' + _name + "-G" + i) ;
        if(ele1.length){
            if(i == '1'|| i == '2' || i == '3'){
                    //ele1.attr('percent', Vars[i]);
                    //console.log('progress 1~3 : ' + i + ', style=' + 'width:' + Vars[i] + '%') ;
                    ele1.attr('style', 'width:' + Vars[i] + '%');
            }else{
                    //console.log('progress 4~7 : ' + i + ', stroke-dasharray=' +Vars[i] + ', 100') ;
                    //stroke-dasharray="15, 100"
                    ele1.attr('stroke-dasharray', Vars[i] + ', 100');
            }
        }
        //if(ele.length) datas[i] = ele.text() ;
        //console.log('progress : ' + Vars[i]);
        //else //console.log('GET Not Found -> .SYS-TXT-'+i.toUpperCase()) ;
    }
}

function move_bar(_id, _percent, _kinds) {
    //console.log('move_bar : ' + _id + ', ' + _percent + '%, ' + _kinds);
    var bar = $('.' + _id);
    //bar.css('height', _percent + '%');
    if (_kinds == 0) {
        bar.css({'height': _percent + '%', 'top': '7px', 'bottom': '' });
    } else if (_kinds == 1) {
        bar.css({'height': _percent + '%', 'top': '', 'bottom': '7px' });
    }
}

/**
* 해당 블럭안의 지정된 ID로 스크롤 이동하기 (table 구조에서 사용)
*
* @param string 블럭의 id(감싸고있는 부모의 블럭ID명)
* @param string 블럭안의 있는 스크롤 이동할 id명
* @return void
*/
var OldOffset = 0;
function targetScrollMove(block_id, target_id, _max_id){
    //var targetset = $("#" + target_id).offset();
    var maxset = $("#" + _max_id).offset();
    var jbSplit = _max_id.split('-');
    var first_id = jbSplit[0];
    for(var i=1; i < jbSplit.length-1; i++){
        first_id += "-"+jbSplit[i];
    }
    first_id += "-0000_1";
    var firstset = $("#" + first_id).offset();
    jbSplit = jbSplit[jbSplit.length-1].split('_');
    var nMax = parseInt(jbSplit[0]) + 1 ;
    jbSplit = target_id.split('-');
    jbSplit = jbSplit[jbSplit.length-1].split('_');

    //console.log('targetScrollMove ', targetset);
    //console.log('targetScrollMove ', firstset);
    //console.log('targetScrollMove ', maxset);

    var nTarger = parseInt(jbSplit[0]);
    var nStep = (maxset.top - firstset.top) / nMax;
    var nPos =  nStep * nTarger;

    //console.log('targetScrollMove ' + nPos + ", " + _max_id + ", " + nTarger + ", " + nMax);
    //console.log('targetScrollMove ' + block_id + ", " + target_id + ", " + _max_id );


//    $('#'+block_id).animate({scrollTop : offset.top}, 400);
    if(nPos < (nStep * 3)){
        nPos = 0;
    }else{
        nPos -= nStep * 3;
    }
    $('#'+block_id).animate({scrollTop : nPos}, 400);
    //console.log('targetScrollMove ' + block_id + ', ' + target_id);
}

function drawPipeLine(_id, _json, _rindex, _bspring){
//    if( _name.length < 5 && _json.length < 5 ) {
//        console.log('This Func error Parameter.') ;
//        return ;
//    }
    var JDraw = null ;
    //console.log('progress : ' + _json)
    if(_json == 'null'){
        var canvas = document.getElementById(_id);
        var ctx = canvas.getContext("2d");
        // 픽셀 정리
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }else{
        JDraw = JSON.parse(_json);
    }
    if( !JDraw ) {
        console.log('progress Func not json.') ;
        return ;
    }
    var nRPoint = _rindex * 2;
    var jSize = Object.keys(JDraw).length ;
    var dTLength = 0.0;

    for(var i in JDraw){
        dTLength += parseFloat(JDraw[i]);
        //console.log(i + " :" + JDraw[i] + ", " + dTLength.toFixed(2)) ;
    }
    var T_XSize = 1150;
    var start = 50;
    //console.log('drawPipeLine : ' + _rindex + ", " + _bspring);
    var canvas = document.getElementById(_id);
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        // 픽셀 정리
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        var nStart = start;
        var nNext = start;
        var nWidth = 0;
        var step, nColor;
        var dBS = T_XSize * _bspring / dTLength;
        //console.log('drawPipeLine : ' + T_XSize + ", " + JDraw[1] + ", " + _bspring + ", " + dTLength);
        for(step=0; step< jSize; step++){
            if(step%2 == 0){
                if(step == 0){
                    ctx.fillStyle = 'rgb(255, 0, 255)';
                }else if(step == jSize-1){
                    ctx.fillStyle = 'rgb(255, 0, 0)';
                }else{
                    nColor = 'rgb(255, 0, ' + parseInt(256 - (step * 256 / (jSize-1))) + ')';
                    ctx.fillStyle = nColor;
                    //console.log('ctx.fillStyle = ' + ctx.fillStyle + ', '  + nColor);
                }
            }else{
                ctx.fillStyle = "#0000FF";
            }
            nWidth = T_XSize * JDraw[step] / dTLength;
            ctx.fillRect(nStart,60,nWidth,20);
            if(dBS > 0){
                if(step != 0 && step <= nRPoint && step%2 == 0){
                    ctx.fillStyle = "#FFFF00";
                    if(dBS < 2){
                        ctx.fillRect(nStart,60,2,20);
                    }else{
                        ctx.fillRect(nStart,60,dBS,20);
                    }
                }
                if( step >= nRPoint && step < (jSize-1) && step%2 == 0){
                    ctx.fillStyle = "#FFFF00";
                    if(dBS < 2){
                        ctx.fillRect(nStart+nWidth-2,60,2,20);
                    }else{
                        ctx.fillRect(nStart+nWidth-dBS,60,dBS,20);
                    }
                }
            }
            //console.log("index : " + step + ", " + nRPoint);
            if(step == nRPoint){
                ctx.fillStyle = "#00FF00";
                ctx.fillRect(nStart+(nWidth+dBS)/2,50, 4,40);
            }
            nNext += nWidth;
            //console.log('fillRect : ' + nStart + ', ' + nWidth + ', ' + nNext);
            nStart = nNext;
        }
        ctx.stroke();
    }
}

// 지정된 index 값으로 select 하기
//$('#ID option:eq(2)').prop('selected', true); // option 3번째 선택
function setSelIndex(_id, _index){
    //console.log('setSelIndex ' + _id + ', ' + _index);
    $('#'+_id + ' option:eq(' + _index +')').prop('selected', true);
}

function freshSel(_id, _json){
//    if( _name.length < 5 && _json.length < 5 ) {
//        console.log('This Func error Parameter.') ;
//        return ;
//    }
    var JSelBox = null ;
    //console.log('progress : ' + _id + ", "  + _json)
    if(_json == 'null'){
        var BoxId =  $('#' + _id);
        BoxId.empty();
        BoxId.append($('<option selected>Plase do the Calcuration</option>'));
        return;
    }else{
        JSelBox = JSON.parse(_json);
    }
    if( !JSelBox ) {
        console.log('progress Func not json.') ;
        return ;
    }
    var BoxId =  $('#' + _id);
    var size = Object.keys(JSelBox).length;
    //console.log("size :" + size) ;
    var option;
    BoxId.empty();

    for(var i in JSelBox)
    {
        if(i == (size - 1)){
            option = $('<option selected>' + i + ', ' + JSelBox[i] + '</option>');
        }else{
            option = $('<option>' + i + ', ' + JSelBox[i] + '</option>');
        }
        BoxId.append(option);
        //console.log(i + ' : ' + JSelBox[i] + ', ' + option.toString()) ;
    }
}
//<div id="hello" class="color-red color-brown foo bar"></div>
//<div id="hello" class="foo bar"></div>
//$("#hello").removeClass (function (index, className) {
//    return (className.match (/(^|\s)color-\S+/g) || []).join(' ');
//});
//$('div').attr('class', function(i, className){
//    return className.replace(/(^|\s)color-\S+/g, '');
//});
//<div class="circle-graph graph-4" data-percent="55">

/*window.onpopstate = function(event)
{

    ////console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    if(event.state)
    {
        pageLoad( $('[data-role="one"]', $(event.state.page)), event.state.role, event.state.url ) ;
    }
    else {
        displayBlock_action( false );
    }

};*/
$(function () {
//_jscss_load("load", "file:///android_asset/js/jquery.jscssfile.min.js") ;
});
/**
* 모바일 앱과 연동없이 작업시 에러방지
* 웹개발 모드를 위해서 javascript interface 명을 강제로 선언
*/
if (typeof Maru_status === 'undefined') var Maru_status = {};
if (typeof Maru_handle === 'undefined') var Maru_handle = {};
//if (typeof Maru_design === 'undefined') var Maru_design = {};
//if (typeof Maru_code === 'undefined') var Maru_code = {};
//if (typeof Maru_edit === 'undefined') var Maru_edit = {};
//if (typeof Maru_parameter === 'undefined') var Maru_parameter = {};
//if (typeofMaru_doc === 'undefined') var Maru_doc = {};

//baseURL = '';
