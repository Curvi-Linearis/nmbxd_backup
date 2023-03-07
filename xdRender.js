var xdJson,jsonURL;
jsonURL = "1.json"
const resultApp = {
    data() {
        return {
            xdJson : {},
            seen : true,
            replies : [],
            flag : 1
        }
    },
    methods:{
        isPo(uid){
            return uid == this.xdJson.user_hash;
        },
        isSage(){
            return this.xdJson.sage
        },
        getPictureUrl(){
            if(this.xdJson.img == "") return false;
            return "https://image.nmb.best/image/" + this.xdJson.img + this.xdJson.ext
        },
        getReplyPictureUrl(index){
            if(this.replies[index].img == "") return false;
            else return "https://image.nmb.best/image/" + this.replies[index].img + this.replies[index].ext;
        },
        hasName(index){
            if(index == 0)
                return !(this.xdJson.name == "\u65e0\u540d\u6c0f");
            else
                return !(this.replies[index].name == "\u65e0\u540d\u6c0f")
        },
        hasTitle(index){
            if(index == 0)
                return !(this.xdJson.title == "\u65e0\u6807\u9898");
            else
                return !(this.replies[index].title == "\u65e0\u6807\u9898")
        }
    }
}

const vm = Vue.createApp(resultApp).mount('#renderArea');
function nextPage(){
    $.ajax({
        url: jsonURL,
        type: "GET",
        async: false,
        dataType: "json",
        success: 
        function (data) {
            xdJson = data;
            vm.xdJson = xdJson;
            replies = JSON.parse(JSON.stringify(vm.xdJson.Replies)).slice(1);
            for(i = 0; i < replies.length; i++){
                rep = replies[i].content.match(/&gt;&gt;No.[0-9]{7,8}/);
                if(rep){
                    for(j = 0; j < rep.length; j++)
                    replies[i].content = replies[i].content.replace(rep[j],"<a href='#"+ rep[j].slice(11) + "'>" + rep[j] + "</a>")
                }
            }
            vm.replies.push.apply(vm.replies,replies);
            npflag = true;
        },
        error:
        function () {
            npflag = false;
        }
    });
}
nextPage();

$(window).scroll(function(){
    // scroll at bottom
    if ($(window).scrollTop() + $(window).height() + 10 >= $(document).height()) {
        // load data
            jsonURL = (vm.flag + 1).toString() + ".json";
            $.when(nextPage()).done(function(){if(npflag) vm.flag += 1;});
    }
});