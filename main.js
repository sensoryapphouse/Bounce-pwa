window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
    camStart();
}

var canvas;
var splash;
var button;
var button1;
var button2;
var button3;
var inMenu = true;
var panel;
var panelvisible = false;
var settings;
var home;
var Winner;
var singleSwitch = 0; // one or two switches
var holdSwitch = 1; // able to hold switc down or just tap it
var direction = 1;
var leftHeldDown = false;
var rightHeldDown = false;
var mute = false;

var applause;
var aargh01;
var bounce;
var frog;
var ufo;
var firsttime = true;

function PlaySound(s) {
    if (mute.checked)
        return;
    try {
        switch (s) {
            case 'applause.mp3':
                applause.play();
                break
            case 'aargh01.mp3':
                aargh01.play();
                break;
            case 'bounce.mp3':
                bounce.play();
                break;
            case 'frog.mp3':
                frog.play();
                break;
            case 'ufo.mp3':
                ufo.play();
                break;
        }
    } catch (e) {};
}

function InitSounds() {
    if (firsttime) {
        applause = new Audio('sounds/applause.mp3');
        applause.volume = 0;
        applause.play();
        aargh01 = new Audio('sounds/aargh01.mp3');
        aargh01.volume = 0;
        aargh01.play();

        bounce = new Audio('sounds/bounce.mp3');
        bounce.volume = 0;
        bounce.play();

        frog = new Audio('sounds/frog.mp3');
        frog.volume = 0;
        frog.play();

        ufo = new Audio('sounds/ufo.mp3');
        ufo.volume = 0;
        ufo.play();
        setTimeout(function () {
            bounce.pause();
            aargh01.pause();
            frog.pause();
            ufo.pause();
            applause.pause();
            applause.volume = 1;
            aargh01.volume = 1;
            bounce.volume = 1;
            frog.volume = 1;
            ufo.volume = 1;
        }, 50);

        firsttime = false;
    }
}

function leftSwitchDown() {
    if (singleSwitch) {
        direction = 1 - direction;
        if (direction == 0)
            Player.prototype.goLeft();
        else
            Player.prototype.goRight();
    } else
        Player.prototype.goLeft();
}

function leftSwitchUp() {
    if (holdSwitch == 0) {
        Player.prototype.stopLeft();
        Player.prototype.stopRight();
    }
}

function rightSwitchDown() {
    if (singleSwitch) {
        leftSwitchDown();
        return;
    }
    Player.prototype.goRight();
}

function rightSwitchUp() {
    if (singleSwitch) {
        leftSwitchUp();
        return;
    }
    if (holdSwitch == 0)
        Player.prototype.stopRight();
}

function hideMenu() {
    splash.hidden = true;
    button.hidden = true;
    button1.hidden = true;
    button2.hidden = true;
    button3.hidden = true;
    settings.hidden = true;
    panel.hidden = true;
    inMenu = false;
    home.hidden = false;
    Winner.hidden = true;
}

function showMenu() {
    // also stop game playing
    Winner.hidden = true;
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    settings.hidden = false;
    panel.hidden = false;
    home.hidden = true;
    inMenu = true;
}

function slideTo(el, left) {
    var steps = 10;
    var timer = 25;
    var elLeft = parseInt(el.style.left) || 0;
    var diff = left - elLeft;
    var stepSize = diff / steps;

    function step() {
        elLeft += stepSize;
        el.style.left = elLeft + "vw";
        if (--steps) {
            setTimeout(step, timer);
        }
    }
    step();
}

StoreValue = function (key, value) {
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
    }
};

RetrieveValue = function (key, defaultValue) {
    var got;
    try {
        if (window.localStorage) {
            got = window.localStorage.getItem(key);
            if (got == 0) {
                return got;
            }
            if (got == "") {
                return got;
            }
            if (got == "false")
                return false;
            if (got) {
                return got;
            }
            return defaultValue;
        }
        return defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

var player;
var platform;
var speed;
var s1;
var s2;
var s3;
var s4;
var jump = 0;

var audio;

function saveSettings() {
    StoreValue("mute", mute.checked);
    StoreValue("speed", speed.value);
    StoreValue("platform", platform.value);
    StoreValue("player", player.value);
    if (s1.checked) {
        singleSwitch = 1;
        StoreValue("oneSwitch", 1);
    } else {
        singleSwitch = 0;
        StoreValue("oneSwitch", 0);
    }
    if (s3.checked) {
        holdSwitch = 1;
        StoreValue("holdSwitch", 1);
    } else {
        holdSwitch = 0;
        StoreValue("holdSwitch", 0);
    }
}

function Start(i) {
    InitSounds();
    saveSettings();
    //Player.prototype.stopJump();
    escapePressed = false;
    hideMenu();
    gameIndex = i; // 0 - 3
    if (jump == 0)
        new SimpleJump().init();
    else
        SimpleJump.prototype.init2();
    jump = 1;
}


function camStart() {
    home = document.querySelector('home');
    home.style.left = "1vw";
    home.hidden = true;
    Winner = document.querySelector('winner');
    Winner.hidden = true;
    splash = document.querySelector('splash');
    canvas = document.getElementById('game');
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');

    panel.style.left = "130vw";
    slideTo(panel, 130);

    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "16vw";
    mute.style.top = "3vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    speed = document.createElement("INPUT");
    speed.setAttribute("type", "range");
    speed.style.position = "absolute";
    speed.style.height = "2vh";
    speed.style.width = "15vw";
    speed.style.left = "4vw";
    speed.style.top = "9vh";
    speed.style.color = 'green';
    speed.value = 3;
    speed.min = 1;
    speed.max = 5;
    platform = document.createElement("INPUT");
    platform.setAttribute("type", "range");
    platform.style.position = "absolute";
    platform.style.height = "2vh";
    platform.style.width = "15vw";
    platform.style.left = "4vw";
    platform.style.top = "13vh";
    platform.style.color = 'green';
    platform.value = 3;
    platform.min = 1;
    platform.max = 5;
    player = document.createElement("INPUT");
    player.setAttribute("type", "range");
    player.style.position = "absolute";
    player.style.height = "2vh";
    player.style.width = "15vw";
    player.style.left = "4vw";
    player.style.top = "17vh";
    player.style.backgroundColor = 'green';
    player.value = 3;
    player.min = 1;
    player.max = 5;

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "3vh";
    s1.style.width = "3vw";
    s1.style.left = "1.5vw";
    s1.style.top = "21vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "3vh";
    s2.style.width = "3vw";
    s2.style.left = "1.5vw";
    s2.style.top = "25vh";
    s3 = document.createElement("INPUT");
    s3.style.position = "absolute";
    s3.style.height = "3vh";
    s3.style.width = "3vw";
    s3.style.left = "13vw";
    s3.style.top = "21vh";
    s4 = document.createElement("INPUT");
    s4.style.position = "absolute";
    s4.style.height = "3vh";
    s4.style.width = "3vw";
    s4.style.left = "13vw";
    s4.style.top = "25vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");
    s3.setAttribute("type", "radio");
    s4.setAttribute("type", "radio");

    s2.checked = true;
    s4.checked = true;

    function switchOption(i) {
        switch (i) {
            case 1:
                s1.checked = true;
                s2.checked = false;
                break;
            case 2:
                s2.checked = true;
                s1.checked = false;
                break;
            case 3:
                s3.checked = true;
                s4.checked = false;
                break;
            case 4:
                s4.checked = true;
                s3.checked = false;
                break;
        }
    }

    s1.onclick = function (e) {
        switchOption(1);
    }
    s2.onclick = function (e) {
        switchOption(2);
    }
    s3.onclick = function (e) {
        switchOption(3);
    }
    s4.onclick = function (e) {
        switchOption(4);
    }

    panel.appendChild(mute);
    panel.appendChild(speed);
    panel.appendChild(platform);
    panel.appendChild(player);
    panel.appendChild(s1);
    panel.appendChild(s2);
    panel.appendChild(s3);
    panel.appendChild(s4);

    settings.style.left = "92vw";
    mute.checked = RetrieveValue("mute", false);
    speed.value = RetrieveValue("speed", 3);
    platform.value = RetrieveValue("platform", 3);
    player.value = RetrieveValue("player", 3);
    if (RetrieveValue("oneSwitch", 1) == 1) {
        s1.checked = true;
        s2.checked = false;
        singleSwitch = 1;
    } else {
        singleSwitch = 0;
        s2.checked = true;
        s1.checked = false;
    }
    if (RetrieveValue("holdSwitch", 1) == 1) {
        holdSwitch = 1;
        s3.checked = true;
        s4.checked = false;
    } else {
        holdSwitch = 0;
        s4.checked = true;
        s3.checked = false;
    }

    settings.onclick = function (e) { // speed, platform size, player size
        if (panelvisible) { // save stored values
            slideTo(panel, 130);
            slideTo(settings, 92);
            saveSettings();
        } else {
            slideTo(panel, 75);
            slideTo(settings, 78);
        }
        panelvisible = !panelvisible;
    }

    home.onmousedown = function (e) {
        event.preventDefault();
        clearTimeout(endTmr);
        escapePressed = true;
        showMenu();
    }

    button.onmousedown = function (e) {
        event.preventDefault();
        Start(0);
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        Start(1);
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        Start(2);
    }
    button3.onmousedown = function (e) {
        event.preventDefault();
        Start(3);
    }
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 27:
                event.preventDefault();
                //            window.open("index.html", "_self")
                escapePressed = true;
                clearTimeout(endTmr);
                showMenu();
                break;
            case 49:
            case 32:
                event.preventDefault();
                if (leftHeldDown)
                    return;
                leftHeldDown = true;
                if (!inMenu)
                    leftSwitchDown();
                break;
            case 81: // Q
            case 37: // left
                event.preventDefault();
                if (leftDown)
                    return;
                if (!inMenu)
                    Player.prototype.goLeft();
                break;
            case 65:
            case 39: // right
                event.preventDefault();
                if (rightDown)
                    return;
                if (!inMenu)
                    Player.prototype.goRight();
                break;
                break;
            case 50:
            case 51:
            case 13:
                event.preventDefault();
                if (rightHeldDown)
                    return;
                rightHeldDown = true;
                if (!inMenu)
                    rightSwitchDown();
                break;
        }
    }

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 27:
                event.preventDefault();
                break;
            case 81: // Q
            case 37: // left
                event.preventDefault();
                if (!inMenu)
                    Player.prototype.stopLeft();
                break;
            case 49:
            case 32:
                event.preventDefault();
                leftHeldDown = false;
                if (!inMenu)
                    leftSwitchUp();
                break;
            case 65:
            case 39: // right
                event.preventDefault();
                if (!inMenu)
                    Player.prototype.stopRight();
                break;
            case 50:
            case 51:
            case 13:
                event.preventDefault();
                rightHeldDown = false;
                if (!inMenu)
                    rightSwitchUp();
                break;
        }


    }

    document.onmousedown = function (e) {
        if (inMenu)
            return;
        if (e.x < window.innerWidth / 2)
            Player.prototype.goLeft();
        else
            Player.prototype.goRight();
    }
    document.onmouseup = function (e) {
        if (inMenu)
            return;
        if (e.x < window.innerWidth / 2)
            Player.prototype.stopLeft();
        else
            Player.prototype.stopRight();
    }

    document.ontouchstart = function (e) {
        if (inMenu)
            return;
        if (e.touches[0].clientX < window.innerWidth / 2)
            Player.prototype.goLeft();
        else
            Player.prototype.goRight();
    }
    document.ontouchend = function (e) {
        if (inMenu)
            return;
        if (e.touches[0].clientX < window.innerWidth / 2)
            Player.prototype.stopLeft();
        else
            Player.prototype.stopRight();
    }

    function Highlight() {
        button.style.opacity = .7;
        button1.style.opacity = .7;
        button2.style.opacity = .7;
        button3.style.opacity = .7;

        switch (menuItem) {
            case 0:
                button.style.opacity = 1.;
                break;
            case 1:
                button1.style.opacity = 1.;
                break;
            case 2:
                button2.style.opacity = 1.;
                break;
            case 3:
                button3.style.opacity = 1.;
                break;
        }
    }

    var menuItem = 0;

    function showPressedButton(index) {
        console.log("Press: ", index);
        if (inMenu) {
            switch (index) {
                case 0: // A
                case 1: // B
                case 2: // X
                case 3: // Y
                    Start(menuItem);
                    break;
                case 12: // dup
                    if (menuItem >= 2)
                        menuItem -= 2;
                    Highlight();
                    break;
                case 13: // ddown
                    if (menuItem < 3)
                        menuItem += 2;
                    Highlight();
                    break;
                case 14: // dleft
                    if (menuItem > 0)
                        menuItem--;
                    Highlight();
                    break;
                case 15: // dright
                    if (menuItem < 4)
                        menuItem++;
                    Highlight();
                    break;
            }
            console.log("Menu: ", menuItem);
        } else switch (index) {
            case 4: // LT
            case 0: // A
                leftSwitchDown();
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 16:
                break;
            case 14: // dleft
                if (leftDown)
                    return;
                if (!inMenu)
                    Player.prototype.goLeft();
                break;
            case 15: // dright
                if (rightDown)
                    return;
                if (!inMenu)
                    Player.prototype.goRight();
                break;
            case 5: // RT
            case 1: // B left down
                rightSwitchDown();
                break;
            case 2: // X right up
                break;
            case 3: // Y right down
                break;
            case 10: // XBox
                escapePressed = true;
                break;
            default:
        }
    }

    function removePressedButton(index) {
        console.log("Releasd: ", index);
        if (inMenu) {
            console.log("Menu: ", menuItem);
        } else switch (index) {
            case 4: // LT
            case 0: // A
                leftSwitchUp();
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 16:
                break;
            case 14: // dleft
                if (!inMenu)
                    Player.prototype.stopLeft();
                break;
            case 15: // dright
                if (!inMenu)
                    Player.prototype.stopRight();
                break;
            case 5: // RT
            case 1: // B left down
                rightSwitchUp();
                break;
            case 2: // X right up
                break;
            case 3: // Y right down
                break;
            case 10: // XBox
                break;
            default:
        }
    }

    var gpad;

    gamepads.addEventListener('connect', e => {
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        Highlight();
        gpad = e.gamepad;
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();
}
