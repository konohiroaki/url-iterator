var loader = {

    state : false,
    list : [],
    index : 0,
    tab : undefined,

    go_page : function(page){
        if(!loader.state){ return; }
        var tmp = loader.index + page;
        if(tmp < 0 || tmp >= loader.list.length){
            alert("No URLs anymore!");
        }else{
            loader.index = tmp;
            chrome.tabs.update(loader.tab.id, {url:loader.list[loader.index]});
        }
    },

    start : function(){
        loader.state = true;
        loader.list = JSON.parse(localStorage["list"]);
        chrome.tabs.create({url:loader.list[loader.index]}, function(obj){
            loader.tab = obj;
        });
    },

    reset : function(){
        loader.state = false;
        loader.list = [];
        loader.index = 0;
        chrome.tabs.remove(loader.tab.id);
    }
};

chrome.commands.onCommand.addListener(function(command){
    switch(command){
        case "NextURL":
            loader.go_page(1);
            break;
        case "PrevURL":
            loader.go_page(-1);
            break;
    }
});
