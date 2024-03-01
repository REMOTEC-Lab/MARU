/*html Load script*/
window.addEventListener('load', function () {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function (el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

//모바일,태블릿에서 :active 의사 클래스 대체 방안
$(document).on("touchstart", function () {
});

//마우스 우클릭 및 드래그방지
$(document).on("contextmenu dragstart selectstart", function (e) {
    return false;
});

$(document).ready(function(){

  //
  $(".input-bt-set .input-bt").each(function (){
    var Img = $('.input-bt-set').find(".active img").attr("src").replace("_off.", "_on.");
    $('.input-bt-set').find('.active img').attr('src', Img);
  });

  // 키보드 스크립트
  $keyboard = $('.keyboard');
  var withKeyboard = 'input,textarea';
  $(withKeyboard).on('focus',function(e){
    // $keyboard.show();
    $keyboard.data('target',this);
    $(this).addClass('focused');
  }).on('keydown',function(e){
    return false;
  });
  $(document).on('click',function(e){
    var target = e.target;
    var isTargetKeyboard = $(target).is(withKeyboard) || $(target).is($keyboard) || $keyboard.find(target).length;
    if(!isTargetKeyboard){
      // $keyboard.hide();
      $($keyboard.data('target')).removeClass('focused');
      $keyboard.data('target',null);
    }
  });
  $keyboard.on('click','[data-key]',function(e){
    var $target = $($keyboard.data('target'));
    var key = $(this).data('key');
    var callback = $(this).data('callback');
    var value = ($target.val() || '').split('');
    var targetValue;

    if(!callback){
      if(key){
        value.push(key);
      }
      else{
        value.pop();
      }
    }
    else{
      value = Keyboard[callback](value,key);
    }
    targetValue = Array.isArray(value) ? value.join('') : value.toString();
    $target.val(targetValue);
  });
  var Keyboard = {
    clear: function(keys,key){
      return [];
    },
    equal: function(keys,key){
      return math.eval(keys.join(''));
    },
    shift: function(keys,key){
      $keyboard.find('[data-key]').map(function(i,el){
        var key = ($(el).data('key') || '').toString();
        var isLetter = /[a-zA-Z]/.test(key);
        var loweredCase = key.toLowerCase();
        var isLowerCase = loweredCase === key;
        if(isLetter){
          $(el).data('key',isLowerCase ? key.toUpperCase() : loweredCase).removeClass('lowercase uppercase').addClass(isLowerCase ? 'uppercase' : 'lowercase');
        }
        else{
          var shiftkey = $(this).data('shift') || key;
          $(this).data('shift',key).data('key',shiftkey);
        }
        $(el).find('.regular,.shift').toggleClass('active');
      });
      return keys;
    }
  };

});
