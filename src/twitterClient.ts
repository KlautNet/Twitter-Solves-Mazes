import { TwitterApi } from "twitter-api-v2";
import dotenv from 'dotenv';
dotenv.config();

const userClient = new TwitterApi({
    appKey: process.env.API_KEY!,
    appSecret: process.env.API_KEY_SECRET!,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: process.env.ACCESS_TOKEN!,
    accessSecret: process.env.ACCESS_TOKEN_SECRET!
});

export const rwClient = userClient.readWrite