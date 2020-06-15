// rem适配文件
;
(function(win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    //设备像素比
    var devicePixelRatio = win.devicePixelRatio;
    var tid;

    //缩放比：scale = 1 / dpr = 1/2  -->1是正常大小，dpr是设备像素比
    //metaEl.setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no viewport-fit=cover")
    metaEl.setAttribute("content", "initial-scale=" + .5 + ", maximum-scale=" + .5 + ", minimum-scale=" + .5 + ", user-scalable=no viewport-fit=cover")

    function refreshRem() {
        //页面可视宽度
        var width = docEl.getBoundingClientRect().width;
        //获取浏览器信息
        var ua = navigator.userAgent.toLowerCase();
        //在ua里找不到ipad的时候执行，即普通手机执行
        if (!/ipad/.test(ua)) {
            //  375/2不大于750，所以不执行
            if (width / 2 > 750) {
                width = 750 * dpr
            }
        }
        var rem = width / 10; //37.5
        docEl.style.fontSize = rem + "px";
    }
    win.addEventListener("resize",
        function() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300)
        },
        false);
    win.addEventListener("pageshow",
        function(e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300)
            }
        },
        false);
    refreshRem();

})(window);
console.log("rem适配");