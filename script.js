var popup = {

    start : function(){
        document.getElementById("next_txt").disabled = true;
        var val = document.getElementById("next_txt").value;

        var list = popup.valid_url(val);
        localStorage["list"] = JSON.stringify(list);

        chrome.extension.getBackgroundPage().loader.start();
    },

    reset : function(){
        chrome.extension.getBackgroundPage().loader.reset();
        document.getElementById("next_txt").value = "";
        document.getElementById("current_txt").value = "";
        document.getElementById("prev_txt").value = "";
        document.getElementById("next_txt").disabled = false;
    },

    valid_url : function(val){
        var list = val.split(/\r\n|\r|\n/);
        for(var i=0; i<list.length; i++){
            if(list[i].match(/^https?:\/\//) === null){
                list.splice(i, 1);
                i--;
            }
        }
        return list;
    },

    fill_textarea : function(){
        var bg = chrome.extension.getBackgroundPage();
        if(bg.loader.state !== true){
            return;
        }
        document.getElementById("next_txt").disabled = true;
        var index = bg.loader.index;
        var list = JSON.parse(localStorage["list"]);
        this.fill_next(index, list);
        this.fill_current(index, list);
        this.fill_prev(index, list);
    },

    fill_next : function(index, list){
        if(index+1 >= list.length){ return; }
        var txt = list[index+1];
        for(var i=index+2; i<list.length; i++){
            txt += this.getEOL() + list[i];
        }
        document.getElementById("next_txt").value = txt;
    },

    fill_current: function(index, list){
        document.getElementById("current_txt").value = list[index];
    },

    fill_prev : function(index, list){
        if(index === 0){ return; }
        var txt = "";
        for(var i=3; i>index; i--){
           txt += this.getEOL();
        }
        txt += list[0];
        for(i=1; i<index; i++){
            txt += this.getEOL() + list[i];
        }
        document.getElementById("prev_txt").value = txt;
    },

    getEOL : function(){
        var os = navigator.userAgent;
        if(os.indexOf("Win") >= 0){
            return "\r\n"
        }else if(os.indexOf("Mac") >= 0){
            return "\r"
        }else {
            return "\n"
        }
    }
};

popup.fill_textarea();
document.querySelector('#start').addEventListener('click', popup.start);
document.querySelector('#reset').addEventListener('click', popup.reset);
