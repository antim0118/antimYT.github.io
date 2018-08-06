var gameFilledSnd;
function playStartGameSound() {
        if (!gameFilledSnd) gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/lobby_notification_matchready.wav?raw=true");
        gameFilledSnd.volume = .4;
        gameFilledSnd.play();
        gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/lobby_notification_matchready.wav?raw=true");
        if (!gameFilledSnd) gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/game_ready_02.wav?raw=true");
        gameFilledSnd.volume = .4;
        gameFilledSnd.play();
        gameFilledSnd = new Audio("https://github.com/antimYT/antimYT.github.io/blob/master/game_ready_02.wav?raw=true");
}
