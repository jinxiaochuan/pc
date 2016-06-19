//实现删除的效果
~function(){
    var conList=document.getElementsByClassName("conList")[0];
    var oLis=conList.getElementsByTagName("li");
    var oClose=conList.getElementsByClassName("close");
    for(var i=0;i<oClose.length;i++){
        ~function(i){
            var cur=oClose[i];
            cur.index=i;
            cur.onclick=function(){
                oLis[this.index].style.display="none";
            }
        }(i);
    }
    function parent(curEle,point){
        var flag=false;
        var parent=curEle.parentNode;
        while(parent){
            if(parent===point){
                flag=true;
                break;
            }
            parent=curEle.parentNode;
        }
        return flag;
    }
    conList.onmouseover=function(e){
        e=e||window.event;
        var tar= e.target|| e.srcElement;
        console.log(tar.tagName.toUpperCase());
        if(tar.tagName.toUpperCase()==="LI"&&tar.className==="list_item"){
            utils.lastChild(tar).style.display="block";
            return;
        }
        if((tar.tagName.toUpperCase()==="IMG"||tar.tagName.toUpperCase()==="SPAN")&&tar.parentNode.className==="item_img"){
            utils.lastChild(tar.parentNode.parentNode).style.display="block";
            return;
        }
        if(tar.tagName.toUpperCase()==="A"&&tar.className==="item_desc"){
            utils.lastChild(tar.parentNode).style.display="block";
            return;
        }
        if(tar.tagName.toUpperCase()==="A"&&tar.className==="close"){
            utils.lastChild(tar.parentNode).style.display="block";
            return;
        }
    };
    conList.onmouseout=function(){
        for(var i=0;i<oClose.length;i++){
            oClose[i].style.display="none";
        }
    }
}();
