"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Maze/Player");
const twitterClient_1 = require("./twitterClient");
const node_cron_1 = require("node-cron");
const tweet = async (content) => {
    try {
        const { data: createdTweet } = await twitterClient_1.rwClient.v2.tweet(content);
        return createdTweet;
    }
    catch (error) {
        console.log(error);
    }
    return;
};
const tweetPoll = async (content, pollOptions) => {
    try {
        const { data: createdTweet } = await twitterClient_1.rwClient.v2.tweet(content, { poll: {
                duration_minutes: 10,
                options: pollOptions
            } });
        return createdTweet;
    }
    catch (error) {
        console.log(error);
    }
    return;
};
const getTweetResults = async (tweetId) => {
    var _a;
    const tweet = await twitterClient_1.rwClient.v2.singleTweet(tweetId, {
        expansions: ["attachments.poll_ids"]
    });
    let polls = (_a = tweet.includes) === null || _a === void 0 ? void 0 : _a.polls;
    if (polls) {
        let highestOption = null;
        polls[0].options.forEach((option) => {
            if (highestOption == null) {
                highestOption = option;
            }
            else if (highestOption.votes < option.votes) {
                highestOption = option;
            }
        });
        if (highestOption) {
            return highestOption.label;
        }
    }
    return null;
};
let state = "IDLE";
let lastTweetId = "";
let score = 0;
const player = new Player_1.Player();
const task = async () => {
    if (state == "IDLE") {
        console.log("idle");
        player.move("UP");
        const created = await tweetPoll(player.render() + "\n 🟩 = You \n", player.getMovingOptions());
        lastTweetId = created.id;
        state = "INGAME";
        return;
    }
    else if (state == "INGAME") {
        console.log("ingame");
        let move = await getTweetResults(lastTweetId);
        if (!move) {
            throw new Error("Unable to fetch Move!");
        }
        player.moveRow(move);
        console.log(player.getMovingOptions());
        if (player.mazeBuilder.isGoal(player.y, player.x)) {
            const created = await tweet(player.render() + "\n 🟩 = You \n");
            lastTweetId = created.id;
            console.log("goal");
            score++;
            await twitterClient_1.rwClient.v2.reply(`Congratulations 🎉✨ \n\nYou solved the maze! \n\n🕹 Score: ${score} \n\nPlease follow for the next Maze in 10 minutes!

            `, lastTweetId);
            player.resetPlayer();
            state = "IDLE";
        }
        else {
            const created = await tweetPoll(player.render() + "\n 🟩 = You \n", player.getMovingOptions());
            lastTweetId = created.id;
        }
        return;
    }
};
node_cron_1.schedule('*/10 * * * *', () => {
    task();
});
//# sourceMappingURL=index.js.map