const Slack = require("@slack/bolt");
const dayjs = require("dayjs");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const SLACK_SIGNING_SECRET = '21158427195cb421c5335d8ab27d5485';
const SLACK_BOT_TOKEN = 'xoxb-2132134531815-6103810663094-cyeIqfCc9gdkhHtIN7cSBf5E';
const SLACK_CHANNEL = 'post-message';

const intervalMinute = 1;
const intervalTime = intervalMinute * 60 * 1000;
const gapTimeWillNoti = 300000; // 5'

const app = new Slack.App({
    signingSecret: SLACK_SIGNING_SECRET,
    token: SLACK_BOT_TOKEN,
});

setInterval(() => {
    fetch('https://i-test.vn/api/common/now').then(res => res.json()).then(itestServerTime => {
        const gapTime = Math.abs(dayjs().valueOf() - itestServerTime);
        console.log("Time gap: " + gapTime);

        if (gapTime >= gapTimeWillNoti) {
            // server time UTC
            const timeString = dayjs(itestServerTime).add(7, 'h').format('DD/MM/YYYY HH:mm:ss');
            app.client.chat.postMessage({
                token: SLACK_BOT_TOKEN,
                channel: SLACK_CHANNEL,
                text: "<!channel> Server time invalid: " + timeString,
                blocks: [],
            });

            console.log("Noti: " + timeString);
        }
    });
}, intervalTime);