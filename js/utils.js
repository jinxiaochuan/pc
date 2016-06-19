/**
 * Created by lenovo on 2016/4/20.
 */
var utils=function(){
    var flag=!(/MSIE (6|7|8)/i.test(window.navigator.userAgent));
    //var flag="getComputedStyle" in window;
    return {
        //类数组转数组方法listToArray
        listToArray: function (similarArray) {
            var ary=[];
            try{
                ary=Array.prototype.slice.call(similarArray);
            }catch(e){
//在try内程序不报错的情况下，IE7-IE8下会执行catch中的代码，但标准浏览器下（IE9，chrome，FireFox）不执行catch中的代码。
                for(var i=0;i<similarArray.length;i++){
                    ary[ary.length]=similarArray[i];
                }
            }
            return ary;
        },
        //JSON格式字符串转JSON格式对象（数组，对象）
        jsonParse:function(jsonStr){
            return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
        },
        //在原版的IE8中，offsetLeft-->当前元素的外边框距离父级元素的左外边框的偏移量（相当于其他浏览器中clientLeft+offsetLeft）
        //在原版的IE8中，offsetTop-->当前元素的外边框距离父级元素的左外边框的偏移量（相当于其他浏览器中clientTop+offsetTop）
        offSet:function(ele){
            var eleLeft=ele.offsetLeft;//注意：首先应该先获取当前元素的offsetLeft,之后再进行父级参照物的判断
            var eleTop=ele.offsetTop;//注意：首先应该先获取当前元素的offsetTop,之后再进行父级参照物的判断
            var eleParent=ele.offsetParent;
            var left=null;
            var top=null;
            left+=eleLeft;
            top+=eleTop;
            while(eleParent){
//            判断当前浏览器是否是IE 8.0
//            方法一：使用正则 reg=/MSIE 8.0/; reg.test((window.navigator.userAgent)==true-->说明是IE8
//            方法二：使用字符串indexOf属性判断
                if(window.navigator.userAgent.indexOf("MSIE 8.0")==-1){
                    left+=eleParent.clientLeft;
                    top+=eleParent.clientTop;
                }
                left+=eleParent.offsetLeft;//父级参照物的边框+父级参照物的offsetLeft
                top+=eleParent.offsetTop;
                eleParent=eleParent.offsetParent;//继续获取上一个父级参照物，继续判断eleParent是否还有父级参照物，直到body
            }
            return {left:left,top:top};
        },
        //注意：在getWin方法时，
        getWin:function(attr,val){
            if(typeof val!=="undefined"){//注意：undefined不能加引号
                document.documentElement[attr]=val;
                document.body[attr]=val;
            }
            return document.documentElement[attr]||document.body[attr];//必须将document.documentElement放在||前面
        },
        children:function(curEle,tagName){
            var ary=[];
            if(/MSIE (6|7|8)/i.test(window.navigator.userAgent)){
                var nodeList=curEle.childNodes;
                for(var i=0;i<nodeList.length;i++){
                    var curNode=nodeList[i];
                    curNode.nodeType===1?ary.push(curNode):null;
                }
            }else{
                /*ary=Array.prototype.slice.call(curEle.children);
                 ary=utils.listToArray(curEle.children);*/
                ary=this.listToArray(curEle.children);
            }
            if(typeof tagName==="string"){
                for(var j=0;j<ary.length;j++){
                    var curEleNode=ary[j];
                    if(curEleNode.nodeName.toLowerCase()!==tagName.toLowerCase()){
                        ary.splice(j,1);
                        j--;//防止数组塌陷
                    }
                }
            }
            return ary;
        },
        prev:function(ele){
            if(flag){
                return ele.previousElementSibling;
            }
            var p=ele.previousSibling;
            while(p&& p.nodeType!=1){
                p=p.previousSibling;
            }
            return p;
        },
        next:function(ele){
            if(flag){
                return ele.nextElementSibling;
            }
            var p=ele.nextSibling;
            while(p&& p.nodeType!=1){
                p=p.nextSibling;
            }
            return p;
        },
        prevAll:function(ele){
            var arr=[];
            var p=this.prev(ele);
            while(p){
                arr.unshift(p);
                p=this.prev(p);
            }
            return arr;
        },
        nextAll:function(ele){
            var arr=[];
            var n=this.next(ele);
            while(n){
                arr.push(n);
                n=this.next(n);
            }
            return arr;
        },
        //获取相邻元素-->上一个哥哥和下一个弟弟
        sibling:function(ele){
            var arr=[];
            this.prev(ele)?arr.push(this.prev(ele)):false;
            this.next(ele)?arr.push(this.next(ele)):false;
            return arr;
        },
        //获取所有兄弟元素
        siblings:function(ele){
            return this.prevAll(ele).concat(this.nextAll(ele));
        },
        //获取当前元素的索引值
        index: function (ele) {
            return this.prevAll(ele).length;
        },
        //获取当前元素的第一个元素子节点
        firstChild:function(container){
            if(flag){
                return container.firstElementChild;
            }
            return this.children(container).length?this.children(container)[0]:null;
        },
        //获取当前元素的最后一个元素子节点
        lastChild:function(container){
            if(flag){
                return container.lastElementChild;
            }
            return this.children(container).length?this.children(container)[this.children(container).length-1]:null;
        },
        //将某个元素追加到某个元素里面最后,appendChild是兼容的
        append:function(ele,container){
            return container.appendChild(ele);
        },
        //将某个元素追加到某个元素里面首个
        prepend:function(ele,container){
            //先找到第一个儿子，并插在它前面
            var fir=this.firstChild(container);
            return container.insertBefore(ele,fir);
        },
        //将新的元素插入到oldEle前面
        insertBefore:function(newEle,oldEle){
            return oldEle.parentNode.insertBefore(newEle,oldEle);
        },
        //将新的元素插入到oldEle后面
        insertAfter:function(newEle,oldEle){
            var nex=this.next(oldEle);
            return oldEle.parentNode.insertBefore(newEle,nex);
        },
        hasClass:function(ele,name){
            var reg=new RegExp("(^| +)"+name+"( +|$)");
            return (reg.test(ele.className));
        },
        addClass:function(ele,className){
            //添加之前先判断原来className中有没有
            //将传入的要添加的className按照一到多个空格进行split分割成数组
            var ary=className.replace(/^ +| +$/g,"").split(/\s+/);
            for(var i=0;i<ary.length;i++){
                var cur=ary[i];
                if(!this.hasClass(ele,cur)){
                    ele.className+=" "+cur;//注意：一定要在添加之前加空格字符
                }
            }
        },
        removeClass:function(ele,className){
            var ary=className.replace(/^ +| +$/g,"").split(/ +/g);
            for(var i=0;i<ary.length;i++){
                var cur=ary[i];
                if(this.hasClass(ele,cur)){
                    ele.className=ele.className.replace(cur,"");
                }

            }
        },
        getElementsByClass:function(className,context){
            var context=context||document;
            //在标准浏览器下直接调用getElementsByClassName方法，由于返回的是一个类数组，为保证不论是在IE6~8还是标准浏览器下都返回数组，故直接调用listToArray方法
            if(flag){
                return this.listToArray(context.getElementsByClassName(className));
            }
            var ary=[];
            //将传入的参数className去掉首尾空格之后，再拆分成数组
            var classNameAry=className.replace(/^ +| +$/g,"").split(/ +/g);
            //通过通配符*获取所有的标签
            var nodeList=context.getElementsByTagName("*");
            for(var i=0;i<nodeList.length;i++){
                var curNode=nodeList[i];
                var flag0=true;
                for(var j=0;j<classNameAry.length;j++){
                    var curClass=classNameAry[j];
                    var reg=new RegExp("(^| +)"+curClass+"( +|$)");
                    if(!reg.test(curNode.className)){
                        flag0=false;
                        break;
                    }
                }
                if(flag0){
                    ary[ary.length]=curNode;
                }
            }
            return ary;
        },
        //设置元素样式
        setCss: function(ele,attr,value){
            if(attr=="opacity"){
                if(window.navigator.userAgent.indexOf("MSIE")>=0){
                    ele.style["filter"]="alpha(opacity="+value*100+")";
                }else{
                    ele.style.opacity=value;
                }
                return;
            }
            if(attr=="float"){
                ele.style["cssFloat"]=value;
                ele.style["styleFloat"]=value;
                return;
            }
            var reg=/^(width|height|left|right|top|bottom|(margin|padding)(Top|Bottom|Left|Right)?)$/;
            if(reg.test(attr)){
                //判断传入的参数value是否带单位
                if(!isNaN(value)){
                    value+="px";
                }
            }
            ele.style[attr]=value;
        },
        //批量设置元素样式
        setGroupCss: function (curEle,options) {
            if(Object.prototype.toString.call(options)!=="[object Object]"){
                return;
            }
            for(var key in options){
                if(options.hasOwnProperty(key)){
                    this.setCss(curEle,key,options[key]);
                }
            }
        },
        //获取元素CSS样式
        getCss:function(curEle,attr){
            var val=null;
            var reg=/MSIE\s(?:6|7|8)/;
            if(reg.test(window.navigator.userAgent)){
                if(attr==="opacity"){
                    var reg0=/^alpha\(opacity=(\d+(\.\d+)?)\)$/;
                    val=curEle.currentStyle["filter"];
                    val=val.replace(reg0,function(){
                        return arguments[1]/100;
                    });
                }else{
                    val=curEle.currentStyle[attr];
                }

            }else{
                val=window.getComputedStyle(curEle)[attr];
            }
            var reg1=/^(-?\d+(\.\d+)?)(px|em|pt|rem|deg)?$/;
            return reg1.test(val)?parseFloat(val):val;
        },
        //设置元素样式、批量设置元素样式、获取元素CSS样式
        css:function(curEle){
            if(typeof arguments[1]==="string"){
                if(!arguments[2]){
                    return this.getCss(curEle,arguments[1]);
                }
                this.setCss.apply(this,arguments);
            }
            if(Object.prototype.toString.call(arguments[1])==="[object Object]"){
                this.setGroupCss.apply(this,arguments);
            }
        }

    }
}();

