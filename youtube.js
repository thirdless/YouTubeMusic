window.onload = function(){

    let { ipcRenderer } = require('electron'),
        ipc = ipcRenderer,
        msgstring = "window-youtubemusic-";

    function element(text){
        return document.querySelector(text);
    }

    let backBtn = document.createElement('paper-icon-button');
    backBtn.setAttribute('icon', 'arrow-back');
    backBtn.setAttribute('id', 'backButton');
    backBtn.setAttribute('class', 'x-scope paper-icon-button-0');
    backBtn.style = "position:relative;right:-8px;top:0px;width:48px;height:48px;opacity:1;transition:opacity .2s ease-in-out";

    let pivotBar = element('ytmusic-pivot-bar-renderer');
    pivotBar.insertBefore(backBtn, pivotBar.firstChild);

    let miniBtn = document.createElement('paper-icon-button');
    miniBtn.setAttribute('icon', 'arrow-downward');
    miniBtn.setAttribute('id', 'miniButton');
    miniBtn.setAttribute('class', 'x-scope paper-icon-button-0');
    miniBtn.style = "position:relative;margin-left:20px;width:26px;height:26px;opacity:1;transition:opacity .2s ease-in-out;padding:0;";

    let settingsBar = element('ytmusic-settings-button');
    settingsBar.appendChild(miniBtn, settingsBar.firstChild);

    let closeBtn = document.createElement('paper-icon-button');
    closeBtn.setAttribute('icon', 'close');
    closeBtn.setAttribute('id', 'closeButton');
    closeBtn.setAttribute('class', 'x-scope paper-icon-button-0');
    closeBtn.style = "position:relative;margin-left:20px;width:26px;height:26px;opacity:1;transition:opacity .2s ease-in-out;padding:0;";

    settingsBar.appendChild(closeBtn, settingsBar.firstChild);

    function postmsg(e){
        let msg = msgstring;

        if(e.currentTarget === miniBtn) msg += "mini";
        else if(e.currentTarget === closeBtn){
            msg += "close";
            removelisteners();
        }
        else if(e.type === "keydown") msg += "toggle";

        ipc.sendToHost(msg);
    }

    function back(){
        history.back();
    }

    miniBtn.addEventListener("click", postmsg);
    closeBtn.addEventListener("click", postmsg);
    backBtn.addEventListener("click", back);

    let ctrl = false;

    function ctrldown(e){
        if(e.type === "keydown" && e.ctrlKey) ctrl = true;
        if(e.type === "keyup" && e.ctrlKey) ctrl = false;
    }

    function fdown(e){
        if(ctrl && e.code === "KeyF") postmsg(e);
    }
    
    function searchlisteners(){
        window.addEventListener("keydown", ctrldown);
        window.addEventListener("keyup", ctrldown);
        window.addEventListener("keydown", fdown);
    }

    searchlisteners();

    let title, artist, time;

    function sendDiscordInfo(){
        let object = {},
            now = Date.now(),
            value;
        
        title = element(".title.ytmusic-player-bar");
        artist = element(".subtitle.ytmusic-player-bar yt-formatted-string.ytmusic-player-bar");
        time = element("#progress-bar");

        if(title) object.details = title.innerText;

        if(artist){
            object.state = artist.getAttribute("title")
            if(object.state) object.state = object.state.split("•")[0].replace(/\n/g, "");
        }

        if(time){
            value = time.getAttribute("aria-valuenow");
            object.startTimestamp = now + value * 1000;
            object.endTimestamp = now + (time.getAttribute("aria-valuemax") - value) * 1000;
        }

        object.instance = false;
        object.paused = element("video") && element("video").paused ? true : false;

        ipc.sendToHost(msgstring + "discord " + JSON.stringify(object));
        
    }

    setInterval(sendDiscordInfo, 1e3);

    function removelisteners(){
        miniBtn.removeEventListener("click", postmsg);
        closeBtn.removeEventListener("click", postmsg);
        backBtn.removeEventListener("click", back);
        window.removeEventListener("keydown", ctrldown);
        window.removeEventListener("keyup", ctrldown);
        window.removeEventListener("keydown", fdown);
    }

};

// search

