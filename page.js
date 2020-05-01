let win = require("electron").remote.getCurrentWindow();
const {ipcRenderer} = require("electron");

let msgstring = "window-youtubemusic-",
    searchel = null;

// search

let search = (function(){

    function search(){
        this.webview = document.querySelector("webview");
        this.element = document.querySelector(".search");
        this.elementinput = this.element.querySelector("input");
        this.elementspan = this.element.querySelector("span");
        this.elementclose = this.element.querySelector("p");
        this.webview.addEventListener("found-in-page", this.foundevent.bind(this));
        this.elementclose.addEventListener("click", this.hide.bind(this));
        this.elementinput.addEventListener("keydown", this.keydown.bind(this));
        this.elementinput.addEventListener("keyup", this.keyup.bind(this));
        this.shown = 0;
        this.match = 0;
        this.countdown = "";
    }

    search.prototype.find = function(text, forward){
        if(text) this.webview.findInPage(text, {forward});
        else this.clear();
    }

    search.prototype.foundevent = function(response){
        response = response.result;
        if(response.activeMatchOrdinal) this.match = response.activeMatchOrdinal;
        if(response.finalUpdate){
            if(response.matches === 0) this.match = 0;
            this.elementspan.innerText = this.match + "/" + response.matches;
        }
    }

    search.prototype.keydown = function(e){
        
        let forward = !e.shiftKey,
            text = this.elementinput.value;

        switch(e.code){
            case "Enter":
                this.find(text, forward);
                break;
            case "Escape":
                this.hide();
                break;
        }
    }

    search.prototype.keyup = function(e){
        let text = this.elementinput.value;
        this.find(text, true);
    }

    search.prototype.clear = function(){
        this.webview.stopFindInPage("clearSelection");
        this.elementspan.innerText = "";
    }

    search.prototype.hide = function(){
        this.shown = 0;
        this.elementinput.blur();
        this.clear();
        this.elementinput.value = "";
        this.element.classList.remove("visible");
    }

    search.prototype.show = function(){
        this.shown = 1;
        this.element.classList.add("visible");
        this.elementinput.focus();
    }

    search.prototype.toggle = function(){
        if(!this.shown) this.show();
        else this.hide();
    }

    search.prototype.removelisteners = function(){
        this.webview.removeEventListener("found-in-page", this.foundevent.bind(this));
        this.elementclose.removeEventListener("click", this.hide.bind(this));
        this.elementinput.removeEventListener("keydown", this.keydown.bind(this));
        this.elementinput.removeEventListener("keyup", this.keyup.bind(this));
    }


    return search;
})();

// search end

function removelisteners(){
    searchel.removelisteners();
    document.querySelector("webview").removeEventListener("ipc-message", parseMsg);
}

function parseMsg(e){
    let message = e.channel;

    if(message === msgstring + "close"){
        removelisteners();
        ipcRenderer.send("ytm-close", "close");
    }
    else if(message === msgstring + "mini") win.minimize();
    else if(message === msgstring + "toggle") searchel.toggle();
    else if(!message.indexOf(msgstring + "discord")) ipcRenderer.send("ytm-discord-rp", message.replace(msgstring + "discord ", ""));
}

window.onload = function(){
    let main = document.querySelector(".main");
    
    main.innerHTML = `
        <webview src="https://music.youtube.com" preload="${__dirname + "\\youtube.js"}"></webview>
    `;
    
    searchel = new search();

    let webview = document.querySelector("webview");
    webview.addEventListener("ipc-message", parseMsg);


};


