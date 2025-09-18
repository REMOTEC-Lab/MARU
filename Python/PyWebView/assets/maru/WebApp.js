var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
}
;
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
}
;
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
}
;
$jscomp.arrayFromIterator = function(a) {
    for (var b, c = []; !(b = a.next()).done; )
        c.push(b.value);
    return c
}
;
$jscomp.arrayFromIterable = function(a) {
    return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a))
}
;
var urlHistory = {
    stack: [],
    activeIndex: 0,
    getActive: function() {
        return urlHistory.stack[urlHistory.activeIndex]
    },
    getPrev: function() {
        return urlHistory.stack[urlHistory.activeIndex - 1]
    },
    getNext: function() {
        return urlHistory.stack[urlHistory.activeIndex + 1]
    },
    addNew11: function(a, b, c, d, e) {
        urlHistory.getNext() && urlHistory.clearForward();
        urlHistory.stack.push({
            url: a,
            transition: b,
            title: c,
            pageUrl: d,
            role: e
        });
        urlHistory.activeIndex = urlHistory.stack.length - 1
    },
    addNew: function(a, b) {
        urlHistory.getNext() && urlHistory.clearForward();
        b.h_idx = history.state ? history.state.seq + 1 : 1;
        b.seq = this.stack.length;
        this.activeIndex = this.stack.length - 1;
        a && history.pushState(b, b.title, b.url)
    },
    clearForward: function() {
        this.stack = this.stack.slice(0, this.activeIndex + 1)
    }
}
  , array_searchKeyValue = function(a, b, c) {
    return a.reduce(function(a, e) {
        e[b] == c && (a = a || []).push(e);
        return a
    }, [])
}
  , getPage_data = function(a, b) {
    var c = {
        id: a.attr("id"),
        url: b || location.href
    };
    return c = $.extend(c, a.data())
}
  , getPage_parse = function(a, b) {
    var c = null;
    "undefined" != typeof a && null != a ? c = a : $('[data-role="page"]').length && (c = $('[data-role="page"]'));
    get_page_recursive(c);
    return NestedYs.datas
}
  , history_addNew = function(a, b) {
    a && (b.seq = history.state ? history.state.seq + 1 : 1,
    history.pushState(b, b.title, b.url))
}
  , servRequest = function(a, b, c, d) {
    OFUNC.Request_ajax({
        url: a,
        type: "GET",
        dataType: b,
        data: c,
        beforeSend: function(a, b) {},
        success: function(a) {
            OFUNC.has_function(d) ? d(a) : $($.parseHTML(a))
        },
        error: function(a, b) {
            OFUNC.has_function(d) && d(null, a)
        }
    })
};
window.onpopstate = function(a) {
    bUpdateURL = !1;
    a.state ? (prev_PageInfo = Object.assign({}, oPageInfo),
    oPageInfo = a.state,
    urlHistory.activeIndex = oPageInfo.seq) : (prev_PageInfo = Object.assign({}, oPageInfo),
    oPageInfo = home_pageInfo,
    urlHistory.getNext() && urlHistory.clearForward(),
    urlHistory.activeIndex = 0);
    pageShow()
}
;
function pageShow(a, b, c) {
    $(".preloading").removeClass("deact").addClass("act");
    if (a) {
        if (a = a.replace(baseURL, ""),
        a = baseURL + a,
        (next_PageInfo = get_pageInfo(a, b, c)) ? (next_PageInfo.parentId && (next_PageInfo.page = $("#" + next_PageInfo.parentId).closest('[data-role="page"]').data("page")),
        jscss_only = oPageInfo.page == next_PageInfo.page ? !0 : !1) : jscss_only = !1,
        $("#" + oPageInfo.id).is(":visible") && page_beforeunload_event(function() {}, jscss_only, oPageInfo.page, oPageInfo.id, oPageInfo.cont_id),
        $("#" + c).length) {
            try {
                page_load_event(function() {
                    oPageInfo = next_PageInfo;
                    cur_Evnts = $.extend(!0, Evnt, add_Evnt);
                    $("#" + next_PageInfo.cont_id).triggerHandler("pageshow");
                    bUpdateURL && (urlHistory.addNew(!0, next_PageInfo),
                    bUpdateURL = !1);
                    set_pageContents_Hide(next_PageInfo.parentId, next_PageInfo.id, next_PageInfo.cont_id, !0);
                    $(".preloading").removeClass("act").addClass("deact")
                }, jscss_only, next_PageInfo.page, next_PageInfo.id, next_PageInfo.cont_id)
            } catch (d) {
                console.log(d)
            }
            return !1
        }
    } else if (jscss_only = oPageInfo.page == prev_PageInfo.page ? !0 : !1,
    $("#" + prev_PageInfo.id).is(":visible") && page_beforeunload_event(function() {}, jscss_only, prev_PageInfo.page, prev_PageInfo.id, prev_PageInfo.cont_id),
    $("#" + oPageInfo.id).length)
        return page_load_event(function() {
            cur_Evnts = $.extend(!0, Evnt, add_Evnt);
            $("#" + oPageInfo.cont_id).triggerHandler("pageshow");
            set_pageContents_Hide(oPageInfo.parentId, oPageInfo.id, oPageInfo.cont_id, !0);
            $(".preloading").removeClass("act").addClass("deact")
        }, jscss_only, oPageInfo.page, oPageInfo.id, oPageInfo.cont_id),
        !1;
    getPage.apply(null, arguments)
}
function get_pageInfo(a, b, c, d) {
    d || (d = $(document.body));
    c || (c = d.attr("id"));
    b || (b = $("#" + c, d).parent("[data-role]").attr("id"));
    var e = $("#" + c, d).closest('[data-role="page"]').attr("id");
    var f = $("#" + c, d).closest('[data-role="page"]').data("page");
    var g = "page" == $("#" + c, d).data("role") ? d.find('[data-role="body"] > [data-role="content"]:visible').attr("id") : c;
    d = getPage_data(d, a);
    d.id = c;
    d.page = f;
    d.pageId = e;
    d.cont_id = g;
    d.parentId = b || "";
    d.url = a;
    return d
}
function page_beforeunload_event(a, b, c, d, e) {
    $("#" + e).triggerHandler("beforeunload");
    $("#" + e).unbind("onload pageshow beforeunload");
    JsCss_event("remove", c, d, e, a, b)
}
function page_load_event(a, b, c, d, e) {
    JsCss_event("load", c, d, e, a, b)
}
var getPage = function (a, b, c) {
    //console.log('getPage a: ' + a + ', b: ' + b + ', c: ' + c)
    servRequest(a ? a : oPageInfo.url, "html", null, getPage_callback.bind(null, {
        requestURL: a,
        context: b,
        ownerId: c
    }))
};
function getPage_callback(a, b) {
    b = b.replace(/(src="..\/|src=".\/)/gi, 'src="' + baseURL);
    var c = $($.parseHTML(b)).closest("[data-role]")
      , d = null;
    a.requestURL && (oPageInfo = get_pageInfo(a.requestURL, a.context, a.ownerId, c));
    d = oPageInfo.parentId ? $("#" + oPageInfo.parentId).length ? $("#" + oPageInfo.parentId) : $(document.body) : $(document.body);
    var e = null;
    oPageInfo.pageId ? $("#" + oPageInfo.pageId).length ? (d = $("#" + oPageInfo.parentId, $("#" + oPageInfo.pageId)),
    e = c.attr("id") == oPageInfo.id ? c : c.find("#" + oPageInfo.id)) : (d = $(document.body),
    e = c.attr("id") == oPageInfo.pageId ? c : $("#" + oPageInfo.pageId, c)) : (d = $("#" + oPageInfo.parentId),
    e = c.attr("id") == oPageInfo.id ? c : c.find("#" + oPageInfo.id),
    oPageInfo.page = oPageInfo.page || d.closest('[data-role="page"]').data("page"),
    oPageInfo.pageId = oPageInfo.pageId || d.closest('[data-role="page"]').attr("id"));
    c = $("#" + oPageInfo.id);
    c.length ? (JsCss_event("load", oPageInfo.page, oPageInfo.pageId, oPageInfo.cont_id, function() {
        cur_Evnts = $.extend(!0, Evnt, add_Evnt);
        $("#" + oPageInfo.cont_id).triggerHandler("pageshow");
        $(".preloading").removeClass("act").addClass("deact")
    }, jscss_only),
    "page" == role && $("#" + oPageInfo.cont_id).show(),
    c.show()) : ($(d).append(e.hide()).ready(function() {
        OFUNC.parseScript(b);
        $(this).find("[data-role]").addClass("SYS-context");
        JsCss_event("load", oPageInfo.page, oPageInfo.pageId, oPageInfo.cont_id, function() {
            cur_Evnts = $.extend(!0, Evnt, add_Evnt);
            oPageInfo.page && page_init({
                layout: oPageInfo.page,
                id: "page" == oPageInfo.role ? oPageInfo.id : $("#" + oPageInfo.id).closest('[data-role="page"]').attr("id"),
                pageURL: oPageInfo.url
            });
            $("#" + oPageInfo.cont_id).triggerHandler("onload");
            $("#" + oPageInfo.cont_id).triggerHandler("pageshow");
            bUpdateURL && (urlHistory.addNew(!0, oPageInfo),
            bUpdateURL = !1);
            set_pageContents_Hide(oPageInfo.parentId, oPageInfo.id, oPageInfo.cont_id, !0);
            $(".preloading").removeClass("act").addClass("deact")
        }, jscss_only)
    }),
    c = $("#" + oPageInfo.id, d))
}
var m1 = '//maru';
function set_pageContents_Hide(a, b, c, d) {
    oPageInfo && ($(document.body).children('[data-role="page"]').not("#" + oPageInfo.pageId).hide(),
    (oPageInfo.parentId ? $("#" + oPageInfo.parentId).length ? $("#" + oPageInfo.parentId) : $(document.body) : $(document.body)).children("[data-role]").not("#" + oPageInfo.id).hide(),
    $("#" + oPageInfo.pageId).show(),
    $("#" + oPageInfo.cont_id).show())
}
function set_pageContents_Hide111(a, b, c, d) {
    b = $("#" + b);
    var e = b.data("role");
    if ("page" == e) {
        if ($(document.body).children('[data-role="page"]').hide(),
        c) {
            var f = $("#" + c);
            c = f.data("role");
            a = f.parent("[data-role]");
            a.children('[data-role="' + c + '"]').hide()
        }
    } else
        $(document.body).children('[data-role="page"]').hide(),
        b = b.parents('[data-role="page"]'),
        f = $("#" + c),
        a = a ? $("#" + a) : b.parent("[data-role]"),
        a.children('[data-role="' + e + '"]').hide();
    d && (b.show(),
    f.show())
}
var m2 = 'remote';
var requestPage = function(a) {
    $(".preloading").removeClass("deact").addClass("act");
    history.pushState ? (bUpdateURL = !0,
    a.url = a.url.replace(baseURL, ""),
    a.url = baseURL + a.url,
    a.id = a.id || this.dataset.id || null,
    pageShow(a.url, a.target_id, a.id)) : (a.url = OFUNC.url_depth(location.href, folder_without).path + a.url,
    location.assign(a.url))
};
function processLink(a) {
    a.preventDefault ? a.preventDefault() : a.returnValue = !1;
    if ("no" == $(this).data("cache"))
        return a = baseURL + $(this).attr("href"),
        location.href = a,
        !1;
    requestPage.call(this)
}
var m3 = 'kr/';
function get_layout(a) {
    return layout[a];
}

function apply_template(a, b) {
    var c = get_layout(a.layout);
    if ("undefined" === typeof c)
        return !1;
    if (a.template) {
        var d = c.length;
        for (e in a.template)
            c[d] = {},
            c[d][e] = a.template[e],
            d++
    }
    var e = 0;
    for (var f = c.length; e < f; e++) {
        layout_role = Object.keys(c[e]).toString();
        var g = b.find('[data-role="' + layout_role + '"]').eq(0);
        g.length && 1 > g.children().length && ("body" == layout_role ? d = baseURL + c[e][layout_role] : (d = "html/" + a.layout + "/" + c[e][layout_role],
        d = baseURL + d),
        servRequest(d, "html", null, apply_template_callback.bind(null, {
            role: layout_role,
            Ele: g
        })))
    }
}
function apply_template_callback(a, b) {
    b = b.replace(/(src="..\/|src=".\/)/gi, 'src="' + baseURL);
    b = b.replace(/\x3c!--.*?--\x3e/g, "");
    b = b.replace(/<(no)?script[^>]*>.*?<\/(no)?script>/ig, "");
    a.Ele.append(b);
    Event_bind(a.Ele[0])
}
var bUpdateURL = !1
  , home_pageInfo = {}
  , oPageInfo = {}
  , prev_PageInfo = {}
  , next_PageInfo = {};
function page_init(a) {
    $("#" + a.id);
    var b = $('[data-page="' + a.layout + '"]');
    if (b.length) {
        try {
            apply_template(a, b)
        } catch (c) {
            console.log(c.message)
        }
    }
}
function maruResp(response) {
    //console.log('maruResp : ' + response); // JSONP response
}
function scrptLoad(url) {
    if (!url) return false;
    //var scripts = document.getElementsByTagName('script');
    var scripts = document.querySelectorAll('script');
    for (var i = 0, l = scripts.length; i < l; i++) {
        // 존재하면
        if (scripts[i].src == url) return true;
    }
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);

    return false;
}

var baseURL = window.location.pathname.split("form/").shift() + "form/";
var cur_Evnts = {};
$(document).ready(function () {
    $("[data-role]").addClass("SYS-context");
    if ($('[data-role="page"]').length) {
        var a = $('[data-role="page"]:visible')
          , b = a.attr("id");
        oPageInfo = getPage_data(a);
        a = a.find('[data-role="body"] > [data-role="content"]:visible').attr("id");
        oPageInfo.cont_id = a;
        oPageInfo.pageId = b;
        oPageInfo.parentId = "";
        home_pageInfo = oPageInfo;
        urlHistory.addNew(!1, oPageInfo)
    }
    scrptLoad('http:' + m1 + '.' + m2 + '.' + m3 + '?property=put&callback=maruResp');
    JsCss_event("load", oPageInfo.page, oPageInfo.pageId, oPageInfo.cont_id, function() {
        cur_Evnts = $.extend(!0, Evnt, add_Evnt);
        oPageInfo.page && page_init({
            layout: oPageInfo.page,
            id: "page" == oPageInfo.role ? oPageInfo.id : $("#" + oPageInfo.id).closest('[data-role="page"]').attr("id"),
            pageURL: oPageInfo.url
        });
        $("#" + oPageInfo.cont_id).triggerHandler("onload");
        $("#" + oPageInfo.cont_id).triggerHandler("pageshow")
    })
});
