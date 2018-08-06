function playStartGameSound() {
        if (!gameFilledSnd) gameFilledSnd = new Audio("https://raw.githubusercontent.com/antimYT/antimYT.github.io/master/lobby_notification_matchready.wav");
        gameFilledSnd.volume = .4;
        gameFilledSnd.play();
        gameFilledSnd = new Audio("https://raw.githubusercontent.com/antimYT/antimYT.github.io/master/lobby_notification_matchready.wav");
        if (!gameFilledSnd) gameFilledSnd = new Audio("https://raw.githubusercontent.com/antimYT/antimYT.github.io/master/game_ready_02.wav");
        gameFilledSnd.volume = .4;
        gameFilledSnd.play();
        gameFilledSnd = new Audio("https://raw.githubusercontent.com/antimYT/antimYT.github.io/master/game_ready_02.wav");
}
