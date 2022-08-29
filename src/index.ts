import { Player } from "./Maze/Player";
import { rwClient } from "./twitterClient";
import { schedule } from 'node-cron';

const tweet = async(content: string) => {
    try {
        const { data: createdTweet } = await rwClient.v2.tweet(content)
        return createdTweet;
    } catch (error) {
        console.log(error)
    }
    return;
}

const tweetPoll = async(content: string, pollOptions: Array<string>) => {
    try {
        const { data: createdTweet } = await rwClient.v2.tweet(content, {poll: {
            duration_minutes: 10,
            options: pollOptions
        }})
        return createdTweet;
    } catch (error) {
        console.log(error)
        
    }
    return;
}

const getTweetResults = async(tweetId: string) => {
    const tweet = await rwClient.v2.singleTweet(tweetId, {
       expansions: ["attachments.poll_ids"]
    })
    let polls = tweet.includes?.polls;
    if(polls) {
        let highestOption: any = null;
        polls[0].options.forEach((option) => {
            if(highestOption == null) {
                highestOption = option;
            }else if(highestOption.votes < option.votes) {
                highestOption = option;
            }
        })
        if(highestOption) {
            return highestOption.label;
        }
    }
    return null;
}


let state: State = "IDLE";
let lastTweetId = "";
let score: number = 0;
const player = new Player();

const task = async() => {
    if(state == "IDLE") {
        console.log("idle")
        player.move("UP")
        const created = await tweetPoll(player.render() + "\n 🟩 = You \n", player.getMovingOptions())
        lastTweetId = created!.id;
        state = "INGAME";
        return;
    }else if(state == "INGAME") {
        console.log("ingame")
        let move = await getTweetResults(lastTweetId);
        if(!move) {
            throw new Error("Unable to fetch Move!")
        }
        player.moveRow(move as Direction);
        console.log(player.getMovingOptions());
        if(player.mazeBuilder.isGoal(player.y, player.x)) {
            const created = await tweet(player.render() + "\n 🟩 = You \n")
            lastTweetId = created!.id;
            console.log("goal")
            score++;
            await rwClient.v2.reply(`Congratulations 🎉✨ \n\nYou solved the maze! \n\n🕹 Score: ${score} \n\nPlease follow for the next Maze in 10 minutes!

            `, lastTweetId)
            player.resetPlayer()
            state = "IDLE";
        }else {
            const created = await tweetPoll(player.render() + "\n 🟩 = You \n", player.getMovingOptions())
            lastTweetId = created!.id;
        }
        return;
    }
}

schedule('*/10 * * * *', () => {
   task();
});