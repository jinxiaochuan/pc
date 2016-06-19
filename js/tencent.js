var head_inner=document.getElementById("head_inner");
var quick_history=document.getElementsByClassName("quick_item")[0];
var quick_pop_history=document.getElementsByClassName("quick_pop_history")[0];
/*采用事件委托来实现*/
var pop_child=quick_pop_history.getElementsByTagName("*");
utils.listToArray(pop_child).unshift(quick_pop_history);
console.log(pop_child)
/*鼠标在head_inner之外离开时不消失*/
head_inner.onmouseover=function(e){
    e=e||window.event;
    var tar= e.target|| e.srcElement;
    if(/A|I|SPAN/.test(tar.tagName.toLocaleUpperCase())&&(tar.parentNode.className==="quick_link"||tar.parentNode.id==="quick_history")){
        quick_pop_history.style.display="block";
        zhufengAnimate(quick_pop_history,{opacity:1},300);
        return;
    }
    for(var i=0;i<pop_child.length;i++){
        if(tar===pop_child[i]){
            return;
        }
    }

    quick_pop_history.style.display="none";
    utils.setCss(quick_pop_history,"opacity",0);
}
/*quick_history.onmouseover= function () {
    quick_pop_history.style.display="block";
    zhufengAnimate(quick_pop_history,{opacity:1},300)
};
quick_history.onmouseout=function(){
    quick_pop_history.style.display="none";
    utils.setCss(quick_pop_history,"opacity",0);
    console.log(quick_pop_history.style.opacity)
}*/
/*var quick_history=utils.getElementsByClass("quick_history")[0];
var history=document.getElementById("pop_history");
console.log(history);
quick_history.onmouover=function(){
    history.style.display="block";
}*/
/*图片渐隐渐现*/
//元素的获取
var site_focus=utils.getElementsByClass("site_focus");
var banner=utils.getElementsByClass("bannerList")[0];
var imgList=document.getElementsByClassName("banner");
//数据的获取
var jsonData=null,jasonData2=null;
~function(){
    var xhr=new XMLHttpRequest();
    xhr.open("get","data",false);
    xhr.onreadystatechange=function(){
        if(xhr.readyState===4&&/^2\d{2}$/.test(xhr.status)){
            jsonData=utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
}();
~function(){
    var xhr2=new XMLHttpRequest();
    xhr2.open("get","data_min",false);
    xhr2.onreadystatechange=function(){
        if(xhr2.readyState===4&&/^2\d{2}$/.test(xhr2.status)){
            jasonData2=utils.jsonParse(xhr2.responseText);
        }
    };
    xhr2.send(null);
}();
console.log(jasonData2)
//数据绑定
~function(){
    var str1='',str2='';
    for(var i=0;i<jsonData.length;i++){
        var curData=jsonData[i];
        str1+='<a class="big_banner" href="javascript:;"><img class="banner" src="" trueSrc="'+curData["img"]+'"/></a>';
    }
    str2+='<div class="focus_control"><h2 class="focus_title" title="《奔跑吧兄弟》 中韩开撕！李晨宋智孝牵手">《奔跑吧兄弟》 中韩开撕！李晨宋智孝牵手</h2><div id="focus_thumb" class="focus_thumb"><div id="thumb" class="focus_thumb_inner"><ul id="minBanner" class="focus_thumb_list">';
    for(var j=0;j<jasonData2.length;j++){
        var curData2=jasonData2[j];
        if(j===0){
            str2+='<li class="bg"><img src="'+curData2["img"]+'"/></li>';
        }else{
            str2+='<li><img src="'+curData2["img"]+'"/></li>';
        }
    }
    for(var j=0;j<jasonData2.length;j++){
        var curData2=jasonData2[j];
        str2+='<li><img src="'+curData2["img"]+'"/></li>';
    }
    str2+='</ul></div><a id="leftBtn" class="leftBtn" href="javascript:;"></a><a id="rightBtn" class="rightBtn" href="javascript:;"></a></div></div>';
    banner.innerHTML=str1+str2;
}();
//图片的延迟加载
var aList=utils.children(banner,"a");
window.setTimeout(lazyLoad,1000);
function lazyLoad(){
    for(var i=0;i<imgList.length;i++){
        ~function(i){
            var curImg=imgList[i];
            var oImg=new Image;
            oImg.src=curImg.getAttribute("trueSrc");
            oImg.onload= function () {
                curImg.src=this.src;
                curImg.style.display="block";
                if(i===0){
                    var curA=curImg.parentNode;
                    curA.style.zIndex=1;
                    zhufengAnimate(curA, {opacity: 1}, 1000);
                }
                oImg=null;
            }
        }(i);
    }
}
//banner实现自动轮播
~function(){
    var interval=2000;
    var step=0;
    window.autoTimer=window.setInterval(autoMove,interval);
    function opacityChange(){
        for(var i=0;i<aList.length;i++){
            var curA=aList[i];
            if(i===step){
                curA.style.zIndex=1;
                var curASibings=utils.siblings(curA);
                for(var i=0;i<curASibings.length;i++){
                    curASibings[i].style.zIndex=0;
                }
                zhufengAnimate(curA, {opacity: 1}, 1000,function(){
                    for(var i=0;i<curASibings.length;i++){
                        utils.setCss(curASibings[i],"opacity",0);
                    }
                });
            }
        }
    }
    function autoMove(){
        if(step===aList.length-1){
            step=-1;
        }
        step++;
        opacityChange();
    }





    /*小型轮播图的实现*/
    var minBanner=document.getElementById("minBanner");
    var focus_thumb=document.getElementById("focus_thumb");
    var oLis=minBanner.getElementsByTagName("li");
    var thumb=document.getElementById("thumb");
    var leftBtn=document.getElementById("leftBtn");
    var rightBtn=document.getElementById("rightBtn");
    console.log(oLis);
    minBanner.style.width=jasonData2.length*2*92+"px";
    var minInterval=2000;
    var minStep=0;
    window.minTimer=window.setInterval(minMove,minInterval);
    function minMove(){
        if(minStep==jasonData2.length){
            minStep=0;
            utils.setCss(minBanner,"left",0);
        }
        minStep++;
        focus();
        zhufengAnimate(minBanner,{left:-minStep*92},1000);
    };
    function focus(){
        for(var i=0;i<oLis.length;i++){
            var tempStep=i>=jasonData2.length?0:minStep;
            i===tempStep?utils.addClass(oLis[i],"bg"):utils.removeClass(oLis[i],"bg");
        }
    }
    focus_thumb.onmouseover=function(){
        window.clearInterval(window.minTimer);
        window.clearInterval(window.autoTimer);
        if(minStep>=8){minStep=minStep-8;}
        step=minStep;
        opacityChange();
        console.log(minStep)
    }
    focus_thumb.onmouseout=function(){
        step=minStep;
        minStep=0;
        window.minTimer=window.setInterval(minMove,minInterval);
        window.autoTimer=window.setInterval(autoMove,interval);
    }
    leftBtn.onclick=function(){
        if(minStep===0){
            minStep=jasonData2.length;
            utils.setCss(minBanner,"left",-jasonData2.length*92);
        }
        minStep--;
        focus();
        zhufengAnimate(minBanner,{left:-minStep*92},1000);
    }
    rightBtn.onclick=minMove;
    for(var i=0;i<oLis.length;i++){
        var curLi=oLis[i];
        curLi.index=i;
        curLi.onmouseover=function(){
            minStep=this.index;
            utils.addClass(this,"bg");
            var curLiSiblings=utils.siblings(this);
            for(var i=0;i<curLiSiblings.length;i++){
                utils.removeClass(curLiSiblings[i],"bg");
            }
        };
    }





}();

//小型轮播图的实现
/*~function(){

    var minBanner=document.getElementById("minBanner");
    var focus_thumb=document.getElementById("focus_thumb");
    var oLis=minBanner.getElementsByTagName("li");
    var thumb=document.getElementById("thumb");
    var leftBtn=document.getElementById("leftBtn");
    var rightBtn=document.getElementById("rightBtn");
    console.log(oLis);
    minBanner.style.width=jasonData2.length*2*92+"px";
    var minInterval=2000;
    var minStep=0;
    window.minTimer=window.setInterval(minMove,minInterval);
    function minMove(){
        if(minStep==jasonData2.length){
            minStep=0;
            utils.setCss(minBanner,"left",0);
        }
        minStep++;
        focus();
        zhufengAnimate(minBanner,{left:-minStep*92},1000);
    };
    function focus(){
        for(var i=0;i<oLis.length;i++){
            var tempStep=i>=jasonData2.length?0:minStep;
           i===tempStep?utils.addClass(oLis[i],"bg"):utils.removeClass(oLis[i],"bg");
        }
    }
    focus_thumb.onmouseover=function(){
        window.clearInterval(window.minTimer);
    }
    focus_thumb.onmouseout=function(){
        window.minTimer=window.setInterval(minMove,minInterval);
        window.autoTimer=
    }
    leftBtn.onclick=function(){
        if(minStep===0){
            minStep=jasonData2.length;
            utils.setCss(minBanner,"left",-jasonData2.length*92);
        }
        minStep--;
        focus();
        zhufengAnimate(minBanner,{left:-minStep*92},1000);
    }
    rightBtn.onclick=minMove;
    for(var i=0;i<oLis.length;i++){
        var curLi=oLis[i];
        curLi.index=i;
        curLi.onmouseover=function(){
            minStep=this.index;
            utils.addClass(this,"bg");
            var curLiSiblings=utils.siblings(this);
            for(var i=0;i<curLiSiblings.length;i++){
                utils.removeClass(curLiSiblings[i],"bg");
            }
        };
    }

}();*/
/*回到顶部按钮*/
~function(){
    var site_head=document.getElementsByClassName("site_head")[0];
    var site_nav=document.getElementsByClassName("site_nav")[0];
    var head_bottom=document.getElementsByClassName("head_bottom")[0];
    goTop.onclick=function(){
        window.onscroll=null;
        goTop.style.display="none";
        var distance=utils.getWin("scrollTop");
        var duration=500;
        var interval=10;
        var step=distance/duration*interval;
        var timer=window.setInterval(function(){
            console.log(1);
            var curDis=utils.getWin("scrollTop");
            curDis-=step;
            if(curDis<=0){
                window.clearInterval(timer);
                window.onscroll=scroll;
            }
            utils.getWin("scrollTop",curDis);
        },interval)
    };
    window.onscroll=scroll;
    function scroll(){
        var curScroll=utils.getWin("scrollTop");
        var curClientHeight=utils.getWin("clientHeight")/2;
        console.log(curScroll);
        if(curScroll>15){
            if(site_nav.style.height===0){return};
            zhufengAnimate(site_nav,{height:0,opacity:0},100,function(){
               zhufengAnimate(head_bottom,{height:0,opacity:0},10,function(){
                   zhufengAnimate(site_head,{height:0,opacity:0},200)
               });
            });
        }else if(curScroll>=0&&curScroll<=15){
            console.log(site_nav.style.height==="90px");
            if(site_nav.style.height==="90px"){return};
            zhufengAnimate(site_head,{height:77,opacity:1},200,function(){
                zhufengAnimate(head_bottom,{height:3,opacity:1},10,function(){
                    zhufengAnimate(site_nav,{height:90,opacity:1},100);
                });
            })
        }

        curScroll>curClientHeight?goTop.style.display="block":goTop.style.display="none";
    }
}();

/*鼠标的mouseover事件实现的显示*/

~function(){
    function adMouse(){
        for(var i=0;i<adList.length;i++){
            var curLi=adList[i];
            curLi.index=i;
            curLi.onmouseenter=moveIn;
            curLi.onmouseleave=moveOut;

        }
        function moveIn(){
            var _this=this;
            if(_this.index===4){
                _this.onmouseenter=moveIn;
                zhufengAnimate(_this,{width:994},300);
                zhufengAnimate(adUl,{left:-3*248},300);
                return;
            }
            zhufengAnimate(_this,{width:994},300);
            zhufengAnimate(adUl,{left:-_this.index*248},300)
        }
        function moveOut(){
            console.log("out")
            zhufengAnimate(this,{width:248},300);
            zhufengAnimate(adUl,{left:0},300);
        }
    }
    var ad=document.getElementsByClassName("ad");
    var adUl=ad[0].getElementsByTagName("ul")[0];
    var adList=ad[0].getElementsByTagName("li");
    var bigImg=document.getElementsByClassName("ad_big");
    adMouse();
}();
~function(){
    function adMouse(){
        for(var i=0;i<adList.length;i++){
            var curLi=adList[i];
            curLi.index=i;
            curLi.onmouseenter=moveIn;
            curLi.onmouseleave=moveOut;

        }
        function moveIn(){
            var _this=this;
            if(_this.index===4){
                _this.onmouseenter=moveIn;
                zhufengAnimate(_this,{width:994},300);
                zhufengAnimate(adUl,{left:-3*248},300);
                return;
            }
            zhufengAnimate(_this,{width:994},300);
            zhufengAnimate(adUl,{left:-_this.index*248},300)
        }
        function moveOut(){
            console.log("out")
            zhufengAnimate(this,{width:248},300);
            zhufengAnimate(adUl,{left:0},300);
        }
    }
    var ad=document.getElementsByClassName("ad");
    var adUl=ad[1].getElementsByTagName("ul")[0];
    var adList=ad[1].getElementsByTagName("li");
    var bigImg=document.getElementsByClassName("ad_big");
    adMouse();
}();
/*var ad=document.getElementById("ad");
var adUl=ad.getElementsByTagName("ul")[0];
var adList=ad.getElementsByTagName("li");
var bigImg=document.getElementsByClassName("ad_big");
for(var i=0;i<adList.length;i++){
    var curLi=adList[i];
    curLi.index=i;
    curLi.onmouseover=moveIn;
    curLi.onmouseout=moveOut;

}
function moveIn(){
    var _this=this;
    _this.onmouseout=null;
    if(_this.index===4){
        _this.onmouseout=moveOut;
        zhufengAnimate(_this,{width:994},300);
        zhufengAnimate(adUl,{left:-3*248},300);
        return;
    }
    zhufengAnimate(_this,{width:994},300,function(){
        //zhufengAnimate(_this,{width:248},300);
        _this.onmouseout=moveOut;
    });
    zhufengAnimate(adUl,{left:-_this.index*248},300,function(){
        //zhufengAnimate(adUl,{left:0},300);
        _this.onmouseout=moveOut;
    });
}
function moveOut(){
    console.log("out")
    zhufengAnimate(this,{width:248},300);
    zhufengAnimate(adUl,{left:0},300);
}*/
/*nav导航*/
~function(){
    var site_nav=document.getElementsByClassName("site_nav")[0];
    var oLis=site_nav.getElementsByClassName("anv_item");
    var oUls=site_nav.getElementsByClassName("nav_sub");
    for(var i=0;i<oLis.length;i++){
        var curLi=oLis[i];
        var curUl=oUls[i];
        curLi.liIndex=i;
        curUl.ulIndex=i;
    }
    console.log(oUls);
    site_nav.onmouseover=function(e){
        e=e||window.event;
        var tar= e.target|| e.srcElement;
        if(tar.tagName.toUpperCase()==="LI"&&tar.className==="anv_item"||tar.tagName.toUpperCase()==="A"&&tar.className==="anv_link"){
            var cur=oUls[tar.liIndex]||oUls[tar.parentNode.liIndex];
            cur.style.zIndex=1;
            cur.style.display="block";
            for(var i=0;i<oUls.length;i++){
                if(oUls[i]!==cur){
                    zhufengAnimate(oUls[i],{opacity:0},200,function(){
                        cur.style.zIndex=0;
                    });
                }
            }
            zhufengAnimate(cur,{opacity:0.5},200,function(){
                cur.style.zIndex=0;
            });
            return;
        };
        if(tar.tagName.toUpperCase()==="UL"&&tar.className==="nav_sub"){
            return;
        }
    };
    site_nav.onmouseleave=function(){
        for(var i=0;i<oUls.length;i++) {
            var curUl = oUls[i];
            zhufengAnimate(curUl, {height: 0}, 200, function () {
                this.style.display = "none";
                this.style.zIndex = 0;
                utils.setCss(this, "height", 45);
                utils.setCss(this, "opacity", 0);
            })
        }
    };
}();

/*搜索框的动态数据绑定JQ实现*/
/*$(function(){
    var $searchInput=$("#searchInput");
    var $search=$(".search");
    var $searchList=$search.children(".searchList");
    //--光标进入文本框，判断是否存在内容来控制列表区域的显示隐藏
    $searchInput.on('focus keyup',function(){
        var val=$(this).val().replace(/^ +| +$/g,"");
        if(val.length>0){
            showList();

            return;
        }
        $searchList.stop().slideUp(200);


    });
    $("body").on("click",function(e){
        var tar= e.target,$tar=$(tar);
        if(tar.id==="searchInput"){
            return;
        }
        if(tar.tagName.toLocaleUpperCase()==="LI"&&$tar.parent().hasClass("searchList")){
            $searchList.stop().slideUp(200);
            $searchInput.val($tar.html());
            return;
        }
        $searchList.stop().slideUp(200);
    });
    function showList(){
        var val=$searchInput.val().replace(/^ +| +$/g,"");
        if(val.length===0){
            return;
        }
        $.ajax({
            url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + val,
            type:"get",
            dataType: "jsonp",
            jsonp:"cb",
            success:function(data){
                console.log(data);
                if(data&&data["s"]){
                    data=data["s"];
                    var str='';
                    $.each(data,function(index,item){
                        str+='<li>'+item+'</li>';
                    });
                    $searchList.html(str).stop().slideDown(200);
                }
            }
        });
    }
});*/
/*搜索框的动态数据绑定JS实现*/
~function(){
    var body=document.getElementsByTagName("body")[0];
    var search=document.getElementById("search");
    var searchInput=document.getElementById("searchInput");
    var searchList=document.getElementById("searchList");
    var lenght=null;
    searchInput.addEventListener("click",function(){
        var val=searchInput.value.replace(/^ +| +$/g,"");
        if(val.length>0){
            jsonp();
            searchList.style.display="block";
            zhufengAnimate(searchList,{height:35*lenght},200);
            return;
        }
        zhufengAnimate(searchList,{height:0},200,function(){
            searchList.style.display="none";
        });
    });
    searchInput.addEventListener("keyup",function(){
        var val=searchInput.value.replace(/^ +| +$/g,"");
        if(val.length>0){
            jsonp();
            searchList.style.display="block";
            zhufengAnimate(searchList,{height:35*lenght},200);
            return;
        }
        zhufengAnimate(searchList,{height:0},200,function(){
            searchList.style.display="none";
        });
    });
    function jsonp(){
        var val=searchInput.value.replace(/^ +| +$/g,"");
        var callbackName="callback";
        window.fuck=function(data){
            if(data&&data["item"]){
                data=data["item"];
                lenght=data.length;
                var str='';
                for(var i=0;i<data.length;i++){
                    str+='<li>'+data[i]["word"]+'</li>';
                }
                console.log(str);
                searchList.innerHTML=str;
            }
        };
        var url="http://s.video.qq.com/smartbox?plat=2&ver=0&num=10&otype=json&query="+encodeURIComponent(val)+"&"+callbackName+"=fuck&_="+Math.random();
        var script = document.createElement('script');
        script.src = url;
        script.async = 'async';
        var timer = setInterval(function () {
            if (document.readyState === 'complete') {
                document.body.appendChild(script);
                clearInterval(timer);
            }
        }, 300);
    };
    body.addEventListener("click",function(e) {
        e = e || window.event;
        var tar = e.target || e.srcElement;
        if (tar.tagName.id === "searchInput") {
            return;
        } else if (tar.tagName.toUpperCase() === "LI" && tar.parentNode.id === "searchList") {
            searchInput.value = tar.innerHTML;
            zhufengAnimate(searchList, {height: 0}, 200, function () {
                searchList.style.display = "none";
                return;
            });
        }
        zhufengAnimate(searchList, {height: 0}, 200, function () {
            searchList.style.display = "none";
            return;
        });

    })





}();










/*~function(){
        var anv_ul=document.getElementsByClassName("anv_inner_first")[0];
        var oLis=utils.children(anv_ul,"li");
        var oUls=utils.children(anv_ul,"ul");
        for(var j=0;j<oLis.length;j++){
            ~function(j){
                var curLi=oLis[j];
                var curUl=oUls[j];
                curLi.index=j;
                curUl.index=j;
                curLi.onmouseover=function(){
                    var _this=this;
                    var curUl=oUls[_this.index];
                    for(var i=0;i<oUls.length;i++){
                        if(_this.index===i){
                            curUl.style.zIndex=1;
                            zhufengAnimate(curUl,{opacity:0.5},200);
                        }else{
                            oUls[i].style.zIndex=0;
                            zhufengAnimate(oUls[i],{opacity:0},200);
                        }
                    }
                }
                curLi.onmouseout=function(){
                    var _this=this;
                    var curUl=oUls[_this.index];
                    zhufengAnimate(curUl,{opacity:0},200);
                }
                curUl.onmouseenter=function(){
                    this.style.opacity=0.5;
                }
            }(j)
        }
}();*/



















/*var nav_uls=document.getElementsByClassName("anv_ul");
for(var i=0;i<nav_uls.length;i++){
    ~function(i){
        var curUl=nav_uls[i];
        var curUl_list=curUl.getElementsByClassName("anv_item");
        var aLis=curUl.getElementsByClassName("anv_link");
        var oUl=curUl.getElementsByClassName("nav_sub");
        curUl.onmouseover=function(e){
            e=e||window.event;
            var tar=e.target|| e.srcElement;
            if(tar===oUl){return;}
            for(var i=0;i<oUl.length;i++){
                utils.setCss(oUl[i],"z-index",0);
                if((tar===aLis[i])||(tar===curUl_list[i])){
                    var index=i;
                }
            }
            utils.setCss(oUl[index],"z-index",1)
            if(tar.tagName.toUpperCase()=="LI"||tar.tagName.toUpperCase()=="A"){
                zhufengAnimate(oUl[index],{height:44,opacity:1},500,function(){
                    for(var i=0;i<oUl.length;i++){
                        if(i!==index){
                            utils.setCss(oUl[i],"opacity",0);
                            utils.setCss(oUl[i],"height",44);
                        }
                    }
                })
            }
        }
        curUl.onmouseleave=function(){
            for(var i=0;i<oUl.length;i++){
                zhufengAnimate(oUl[i],{height:0,opacity:0},500)
            }
        }
    }(i)
}*/

/*
var nav_fir=document.getElementsByClassName("anv_inner_first")[0];
var navList_fir=nav_fir.getElementsByClassName("anv_item");
var aLis_fir=nav_fir.getElementsByClassName("anv_link");
var oUl_fir=nav_fir.getElementsByClassName("nav_sub");
console.log(navList_fir)
nav_fir.onmouseover=function(e){
    e=e||window.event;
    var tar=e.target|| e.srcElement;
    for(var i=0;i<oUl_fir.length;i++){
        utils.setCss(oUl_fir[i],"z-index",0);
        if((tar===navList_fir[i])||(tar===aLis_fir[i])){
            var index=i;
        }
    }
    if(tar.tagName.toUpperCase()=="UL"){
        return;
    }
    console.log(oUl_fir[index])
    utils.setCss(oUl_fir[index],"z-index",1)
    if(tar.tagName.toUpperCase()=="LI"||tar.tagName.toUpperCase()=="A"){
        zhufengAnimate(oUl_fir[index],{height:44,opacity:1},500,function(){
            for(var i=0;i<oUl_fir.length;i++){
                if(i!==index){
                    utils.setCss(oUl_fir[i],"opacity",0);
                    utils.setCss(oUl_fir[i],"height",44);
                }
            }
        })
    }

}
nav_fir.onmouseout=function(){
    for(var i=0;i<oUl_fir.length;i++){
        zhufengAnimate(oUl_fir[i],{height:0,opacity:0},500)
    }
}

*/
/*广告ad渐隐渐现自动轮播*/
~function(){
    var tv_ad=document.getElementById("tv_ad");
    var aList=tv_ad.getElementsByTagName("a");
    var imgList=tv_ad.getElementsByTagName("img");
    var ois=tv_ad.getElementsByTagName("i");
    utils.addClass(aList[0],"bg");
    var step=0;
    function adMove(){
        if(step==2){
            step=-1;
        }
        step++;
        focus();
        for(var i=0;i<aList.length;i++){
            var curLi=aList[i];
            curLi.index=i;
            if(i==step){
                utils.setCss(curLi,"zIndex",1);
                var siblings=utils.siblings(curLi);
                for(var i=0;i<siblings.length;i++){
                    utils.setCss(siblings[i],"zIndex",0);
                }
                zhufengAnimate(curLi,{opacity:1},1000,function(){
                    for(var i=0;i<aList.length;i++){
                        if(this.index!==i){
                            utils.removeClass(aList[i],"bg");
                            utils.setCss(aList[i],"opacity",0);
                        }
                    }
                })
            }
        }
    }
    var adTimer=window.setInterval(adMove,2000);
    function focus(){
        for(var i=0;i<ois.length;i++){
            var curI=ois[i];
            var temp=i==ois.length?i=0:i;
            if(temp==step){
                utils.addClass(curI,"tv_ad_bg")
            }else{
                utils.removeClass(curI,"tv_ad_bg")
            }
        }
    }
    for(var i=0;i<ois.length;i++){
        ~function(i){
            var curI=ois[i];
            curI.index=i;
            curI.onmouseover=function(){
                window.clearInterval(adTimer);
                step=this.index-1;
                adMove();
            }
        }(i)
    }
    for(var i=0;i<aList.length;i++){
        ~function(i){
            var curLi=aList[i];
            curLi.onmouseover=function(){
                window.clearInterval(adTimer);
            };
            curLi.onmouseout=function(){
                adTimer=window.setInterval(adMove,2000);
            }
        }(i)
    }
}();

/*登陆页*/
~function(){
    //mouseover实现phone图片渐现效果
    var login=document.getElementById("login");
    var erweima=login.getElementsByClassName("erweima")[0];
    var login_phone=login.getElementsByClassName("login_phone")[0];

    erweima.onmouseover=function(){
        zhufengAnimate(login_phone,{opacity:1},500);
    };
    erweima.onmouseout=function(){
        zhufengAnimate(login_phone,{opacity:0},300);
    };
    //选择对勾
    var tips_select=login.getElementsByClassName("tips_select")[0];
    var tips_select_box=login.getElementsByClassName("tips_select_box")[0];
    tips_select.onclick=function(e){
        e=e||window.event;
        var tar= e.target|| e.srcElement;
        if(tar.tagName.toUpperCase()==="A"||tar.tagName.toUpperCase()==="SPAN"){
            if(utils.hasClass(tips_select_box,"checked")){
                utils.removeClass(tips_select_box,"checked");
                tips_select_box.style.border="1px solid #6fdea3";
                return;
            }
            utils.addClass(tips_select_box,"checked");
            tips_select_box.style.border="none";
        }
    }
    //切换登陆界面
    var login_tab=login.getElementsByClassName("login_tab")[0];
    var qq_login=login.getElementsByClassName("qq_login")[0];
    var weixin_login=login.getElementsByClassName("weixin_login")[0];
    var login_cont=login.getElementsByClassName("login_cont")[0];
    var login_cont_weixin=login.getElementsByClassName("login_cont_weixin")[0];
    login_tab.onclick=function(e){
        e=e||window.event;
        var tar= e.target|| e.srcElement;
        if(tar.tagName.toUpperCase()=="SPAN"){tar=tar.parentNode.parentNode;}
        if(tar.tagName.toUpperCase()=="A"){tar=tar.parentNode;}
        console.log(tar);
        if(utils.hasClass(tar,"bottom")){
            return;
        }else{
            utils.removeClass(qq_login,"bottom");
            utils.removeClass(weixin_login,"bottom");
            login_cont.style.display="none";
            login_cont_weixin.style.display="none";
            utils.addClass(tar,"bottom");
            if(tar===qq_login){
                login_cont.style.display="block";
            }else{
                login_cont_weixin.style.display="block";
            }

        }
    };
    //关闭界面
    var login_close=login.getElementsByClassName("login_close")[0];
    var body_hide=document.getElementsByClassName("body_hide")[0];
    login_close.onclick=function(){
        login.style.display="none";
        body_hide.style.display="none";
        /*utils.setCss(body_hide,"opacity",0);*/
    };
    //开启页面
    var ico_user=document.getElementsByClassName("ico_user")[0];
    ico_user.onclick=function(){
        login.style.display="block";
        body_hide.style.display="block";
    };
    //登陆详情页
    var login_user=document.getElementsByClassName("login_user")[0];
    login_user.onclick=function(){
        window.open("http://localhost:63342/web%20storm/JS%E6%AD%A3%E5%BC%8F%E8%AF%BE/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91/Tencent_co.html")
    }
}();













