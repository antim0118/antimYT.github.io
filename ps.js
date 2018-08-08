// ==UserScript==
// @name         PvPRO scripts
// @namespace    https://github.com/antimYT/
// @version      1.0
// @description  PvPRO scripts
// @author       me
// @match        https://www.pvpro.com/*
// @grant        none
// ==/UserScript==

//доллар к рублю
var dol = 63.73;

function DeleteAds()
{
    //delete promo on main page
    var _elem = document.getElementById('centralBanner');
    var elem = _elem.getElementsByClassName('owl-wrapper-outer')[0];
    if(elem != null)
    {
        elem.parentNode.removeChild(elem);
    }
    elem = _elem.getElementsByClassName('owl-controls clickable')[0];
    if(elem != null)
    {
        elem.parentNode.removeChild(elem);
    }

    //delete 'get free coins' button
    elem = document.getElementsByClassName("top-free-coins flex-middle-left")[0];
    if(elem != null)
    {
        elem.parentNode.removeChild(elem);
    }

    //delete giveaways on main page
    elem = document.getElementById('promo-spots-container');
    if(elem != null)
    {
        elem.parentNode.removeChild(elem);
    }

    //delete footer
    elem = document.getElementById('footer');
    if(elem != null)
    {
        elem.parentNode.removeChild(elem);
    }
}

function NewStyle()
{
    //buttons
    var style1 = ".btn-primary { box-shadow: 0 0 10px 0 rgba(158, 158, 158, 0.5); border: 2px solid #616161; background: #424242; background: #424242;} .btn-primary:hover { box-shadow: 0 0 15px 0 rgba(224, 224, 224, 0.6); border: 2px solid #757575; background-color: #757575; background: #616161;} ";
    var style2 = ".btn-info { border: 2px solid #1e88e5; background: #1565c0; } .btn-info:hover { border: 2px solid #2196f3; background-color: #1976d2; background: #1976d2; } ";
    var style3 = ".ava { border-radius: 50%; -webkit-transition: -webkit-transform .8s ease-in-out; transition:         transform .8s ease-in-out; } .ava:hover { -webkit-transform: rotate(360deg) scaleX(1.2) scaleY(1.2); transform: rotate(360deg) scaleX(1.2) scaleY(1.2); } ";
    var style4 = ".btn-primary { -webkit-transition: -webkit-transform .8s ease-in-out; transition:         transform .8s ease-in-out; } .btn-primary:hover { -webkit-transform: rotate(6deg) scaleX(1.1) scaleY(1.1); transform: rotate(6deg) scaleX(1.1) scaleY(1.1)} ";
    var style8 = ".joined-ladder { -webkit-transition: -webkit-transform .4s ease-in-out; transition:         transform .4s ease-in-out; } .joined-ladder:hover { -webkit-transform: scaleX(2) scaleY(2); transform: scaleX(2) scaleY(2)} ";
    var style9 = ".btn-danger {border: 1px solid #e53935;background: #c62828;}.btn-danger:hover {border: 1px solid #d32f2f;background-color: #b71c1c;background: #b71c1c;}";
    var style10 = "";

    var style_uv1_5 = ".uv1_5 { -webkit-transition: -webkit-transform .4s ease-in-out; transition:         transform .4s ease-in-out; } .uv1_5:hover { -webkit-transform: scaleX(1.5) scaleY(1.5); transform: scaleX(1.5) scaleY(1.5)} ";
    var style_uv2 = ".uv2 { -webkit-transition: -webkit-transform .4s ease-in-out; transition:         transform .4s ease-in-out; } .uv2:hover { -webkit-transform: scaleX(2) scaleY(2); transform: scaleX(2) scaleY(2)} ";
    var style_uv4 = ".uv4 { -webkit-transition: -webkit-transform .4s ease-in-out; transition:         transform .4s ease-in-out; } .uv4:hover { -webkit-transform: scaleX(4) scaleY(4); transform: scaleX(4) scaleY(4)} ";


    //change orange to blue
    var style5 = ".orange { color: #56A1E2!important }";

    var style6 = "body { background: #0C0E11 no-repeat fixed; }";
    var style7 = ".tabs-main>li.store-tab>a,.tabs-main>li.store-tab>a:hover,.tabs-main>li.store-tab>a:visited,.tabs-main>li.store-tab>a:active,.tabs-main>li.store-tab>a:focus {color: white;background: #326799;}.tabs-main>li.store-tab>a:hover,.tabs-main>li.store-tab>a:active,.tabs-main>li.active.store-tab>a {color: white;text-shadow: none;background-color: #13171c;background: #125799;}";

    var styletext = '<style>' + style1 + style2 + style3 + style4 + style5 + style6 + style7 + style8 + style9 + style10 + style_uv1_5 + style_uv2 + style_uv4 + "</style>";
    var body = document.getElementsByTagName("body")[0];
    body.insertAdjacentHTML('beforeend', styletext);
}

function AutoAccept()
{
    setInterval(function() {
        if(document.getElementsByClassName('btn btn-warning ladda-button blink')[0])
        {
            document.getElementsByClassName('btn btn-warning ladda-button blink')[0].click();
        }
    }, 1000);
}

function Animate_CSS()
{
    var sc = document.createElement("script");
    sc.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
    sc.setAttribute("rel", "stylesheet");
    document.head.appendChild(sc);
}

function CoinsToRubles()
{
    var elem = document.getElementById('player-credits-balance');
    var coins = elem.innerHTML;
    elem.innerHTML = (coins, coins + " (~" + (parseInt(parseInt(coins.replace(/,/g, "")) * dol / 1000)) + " rubles)");
}


function JoinSoloToSolo()
{
    setInterval(function() {
        var els = document.getElementsByClassName("btn btn-primary action-btn");

        Array.prototype.forEach.call(els, function(el) {
            if(el.innerHTML == "Join Solo"){
                el.innerHTML = "Solo";
            }
            if(el.innerHTML == "Join Team"){
                el.innerHTML = "Team";
            }
        });

        els = document.getElementsByClassName("btn btn-primary join-game-queue-btn");

        Array.prototype.forEach.call(els, function(el) {
            if(el.innerHTML == "Join Solo"){
                el.innerHTML = "Solo";
            }
            if(el.innerHTML == "Join Team"){
                el.innerHTML = "Team";
            }
        });
    }, 500);
}

function MissionsAnimation()
{
    var mistimer = setInterval(function() {
        var elements = document.getElementsByClassName("mission-sidebar-item  c-pointer");
        for (var i = 0; i < elements.length; i++)
        {
            var el = elements[i];
            el.classList.add("animated");
            el.classList.add("slideInLeft");
        }
        if(elements.length != 0)
        {
            clearInterval(mistimer);
        }
    }, 500);
}


function Increase()
{
    setInterval(function() {
        var elements = document.getElementsByClassName("mr-8");

        Array.prototype.forEach.call(elements, function(el) {
            if(el.className.indexOf("uv2") == -1)
            {
                el.classList.add("uv2");
            }
        });


        elements = document.getElementsByClassName("player-profile-img");

        Array.prototype.forEach.call(elements, function(el) {
            if(el.className.indexOf("ava") == -1)
            {
                el.classList.add("ava");
            }
        });
    }, 1000);
}


function MissionsTranslations()
{
    document.getElementsByClassName("news-sidebar-header")[0].innerHTML = "Миссии";

    var mistrtimer = setInterval(function() {
        var elements = document.getElementsByClassName("mission-sidebar-item c-pointer animated slideInLeft");

        Array.prototype.forEach.call(elements, function(el) {
            el.innerHTML = el.innerHTML.replace("Win a game in ANY mode", "Выиграть игру в любом режиме");
            el.innerHTML = el.innerHTML.replace("Win a 5v5 game and get a kill with an HE Grenade", "Выиграть игру в режиме 5v5 и убить гранатой");


            el.innerHTML = el.innerHTML.replace("Play ", "Сыграть ");
            el.innerHTML = el.innerHTML.replace("public 5v5 games", "игр в режиме 5v5");
            el.innerHTML = el.innerHTML.replace("public 3v3 games", "игр в режиме 3v3");
            el.innerHTML = el.innerHTML.replace("public 2v2 games", "игр в режиме 2v2");
            el.innerHTML = el.innerHTML.replace("public 1v1 games", "игр в режиме 1v1");
            el.innerHTML = el.innerHTML.replace("Public 1v1 games", "игр в режиме 1v1");


            el.innerHTML = el.innerHTML.replace("Win a ", "Выиграть в режиме ");
            el.innerHTML = el.innerHTML.replace(" game with 1 or more bombs defused", " и разминировать 1+ бомб");
            el.innerHTML = el.innerHTML.replace("Get ", "Сделать ");
            el.innerHTML = el.innerHTML.replace(" Headshots", " хедшотов");
            el.innerHTML = el.innerHTML.replace("kills with ", "убийств с ");



            var el2 = el.getElementsByClassName("text-right")[0];
            el2.innerHTML = el2.innerHTML.replace(" Games", " Игр");
            el2.innerHTML = el2.innerHTML.replace(" Game", " Игра");
            el2.innerHTML = el2.innerHTML.replace(" Kills", " Убийств");
            el2.innerHTML = el2.innerHTML.replace(" Bomb Defused", " бомб разминировано");
            //el.innerHTML = el.innerHTML.replace("Play 20 public 5v5 games!", "Сыграть 20 игр 5v5");
            //el.innerHTML = el.innerHTML.replace("Play 20 public 5v5 games!", "Сыграть 20 игр 5v5");
        });

        if(elements.length != 0)
        {
            clearInterval(mistrtimer);
        }

    }, 1000);
}


function LeaguePlaces()
{
    setInterval(function() {
        var _elel1 = document.getElementsByClassName("competition-header-stripe mt-auto pr-10 py-9")[0];
        if(_elel1)
        {
            var _scsc = _elel1.getElementsByTagName('div')[7];
            if (_scsc)
            {
                var myscore = parseFloat(_scsc.innerHTML);

                var element1 = document.getElementById('challengePlayers');
                if(element1)
                {
                    var element2 = element1.getElementsByTagName('tbody')[0];
                    if(element2)
                    {
                        var elements = element2.getElementsByTagName('tr');

                        var i;
                        for(i = 0; i < elements.length; i++)
                        {
                            var el = elements[i];
                            if(el.className == "is_me")
                            {
                                break;
                            }
                            var _sc = el.getElementsByTagName('td')[3];
                            if(_sc){
                                if(_sc.innerHTML.indexOf(" (") == -1)
                                {
                                    _sc.innerHTML += " (" + (parseFloat(_sc.innerHTML) - myscore).toFixed(2) + ")"
                                }
                            }

                        }
                    }
                }
            }
        }

    }, 3000);
}


function Reputation()
{
    var miniprofile = document.getElementById('my-mini-profile-body');
    var _mpbar = miniprofile.getElementsByClassName("progress-bar")[0];
    var _barwidth = window.getComputedStyle(_mpbar).width.replace("%", "");

    var miniprofileheader = document.getElementById('my-mini-profile-header');
    var _mphead = miniprofileheader.getElementsByClassName("flex-middle-left")[0];
    _mphead.innerHTML += "<span class=\"d-none d-md-inline ml-10\"><span class=\"light-blue\">Reputation:</span> " + _barwidth + "</span>";
}


function ReportInGamesTab()
{
    setInterval(function() {
        if(Contains(window.location.href, "/secured/game/history"))
        {
            var gameslist = document.getElementById('gamesList');
            var games = gameslist.getElementsByTagName('tr');
            Array.prototype.forEach.call(games, function(game) {
                var _gameid = game.getElementsByTagName('td')[0];
                var gameid = parseInt(_gameid.innerHTML.replace("# ", ""));
                if(gameid > 0)
                {
                    _gameid.innerHTML = "# " + gameid + " (<a target=\"_blank\" onclick=\"showGameFeedback(" + gameid + ");\" class=\"blue\">report</a>)"
                }
            });

            var element = document.getElementsByClassName('nyroModalCont')[0];
            if(element != null)
            {
                //element.setAttribute("style", "position: fixed; width: 819.984px; height: 500px; top: 197.508px; left: 614.508px; overflow: auto;");
                var windowheight = parseInt(document.getElementsByClassName('nyroModalCont')[0].offsetHeight);
                windowheight = 600;
                if (element.getAttribute("style").indexOf("height: " + windowheight + "px;") == -1)
                {
                    //element.setAttribute("style", element.getAttribute("style") + "height: 800px;");

                    element.setAttribute("style", element.getAttribute("style") + "height: " + windowheight + "px;top: 100px");
                    //top: 150.008px

                    var _elelelelmnt = element.getElementsByTagName('div');

                    Array.prototype.forEach.call(_elelelelmnt, function(_elelelelmn2) {
                        if(Contains(_elelelelmn2.className, "nyroModalBody"))
                        {
                            _elelelelmn2.setAttribute("style", _elelelelmn2.getAttribute("style") + "height: " + (parseInt(windowheight)-150) + "px;");
                        }
                    });

                }
            }
        }
    }, 3000);
}


function TournamentBracketsPlaces()
{
    setInterval(function() {
        var brackets = document.getElementById('bracketsWrapper');
        if(brackets){
            if(brackets.innerHTML.indexOf("[1] ") == -1)
            {
                var _ttems = brackets.getElementsByTagName('div');
                Array.prototype.forEach.call(_ttems, function(_tt) {
                    if(window.getComputedStyle(_tt).clear == "both" && _tt.className != "bracketsGameSeparator")
                    {
                        var rounds1 = 0;
                        var rounds2 = 0;
                        var _rnd1 = _tt.getElementsByTagName('div');
                        Array.prototype.forEach.call(_rnd1, function(_rr) {
                            if(_rr.className == "bracketsDataCol"){
                                rounds1++;
                            }
                        });

                        Array.prototype.forEach.call(_rnd1, function(_rr) {
                            if(_rr.className == "bracketsDataCol"){
                                var round = rounds1 - rounds2;

                                var _ggame = _rr.getElementsByTagName('div');
                                Array.prototype.forEach.call(_ggame, function(_ggm) {
                                    if(_ggm.className == "bracketsGame")
                                    {
                                        var _team = _ggm.getElementsByTagName('div');
                                        Array.prototype.forEach.call(_team, function(_tm) {
                                            _tm.innerHTML = _tm.innerHTML.replace(/  /g, "");

                                            if(round == 7)
                                            {
                                                _tm.innerHTML = "[32-64] " + _tm.innerHTML;
                                            }
                                            if(round == 6)
                                            {
                                                _tm.innerHTML = "[16-32] " + _tm.innerHTML;
                                            }
                                            if(round == 5)
                                            {
                                                _tm.innerHTML = "[8-16] " + _tm.innerHTML;
                                            }
                                            if(round == 4)
                                            {
                                                _tm.innerHTML = "[4-8] " + _tm.innerHTML;
                                            }
                                            if(round == 3)
                                            {
                                                _tm.innerHTML = "[2-4] " + _tm.innerHTML;
                                            }
                                            if(round == 2)
                                            {
                                                _tm.innerHTML = "[1-2] " + _tm.innerHTML;
                                            }
                                            if(round == 1)
                                            {
                                                _tm.innerHTML = "[1] " + _tm.innerHTML;
                                            }

                                        });
                                    }
                                });

                                rounds2++;
                            }
                        });
                    }
                });
            }
        }
    }, 5000);
}

function NewSound()
{
    setInterval(function() {
        if(!gameFilledSnd)
        {
            gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/game_ready_02.wav?raw=true");
        }
        //console.log(gameFilledSnd.getAttribute('src'));
        if (gameFilledSnd.getAttribute('src') != "https://github.com/antimYT/antimYT.github.io/blob/master/game_ready_02.wav?raw=true")
        {
            //console.log("+");
            gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/game_ready_02.wav?raw=true");
        }
        gameFilledSnd.volume = 1.0;
    }, 1000);
}


function Sleep(ms)
{
    ms += new Date().getTime();
    while (new Date() < ms){}
}

function Replace(object, from, to)
{
    if(object.innerHTML.indexOf(to) == -1)
    {
        object.innerHTML = object.innerHTML.replace(from, to);
    }
}

function Contains(string, substring)
{
    return string.indexOf(substring) !== -1;
}


window.addEventListener('load', function() {
    NewSound();
    TournamentBracketsPlaces();
    ReportInGamesTab();
    Reputation();
    LeaguePlaces();
    MissionsTranslations();
    Increase();
    MissionsAnimation();
    JoinSoloToSolo();
    CoinsToRubles();
    Animate_CSS();
    NewStyle();
    DeleteAds();
    AutoAccept();
});
