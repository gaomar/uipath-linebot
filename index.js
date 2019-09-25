const line = require('@line/bot-sdk');
const express = require('express');
const Util = require('./util.js');
require('dotenv').config();

// 環境変数からチャネルアクセストークンとチャネルシークレットを取得する
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};
// LINE クライアントを生成する : `channelSecret` が未定義だと例外が投げられる
const client = new line.Client(config);

// Express アプリを生成する
const app = express();

app.post('/linebot', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
  }
  // handle each event
  Promise
      .all(req.body.events.map(handleEvent))
      .then(() => res.end())
      .catch((err) => {
          console.error(err);
          res.status(500).end();
      });
});

/**
 * イベント1件を処理する
 * 
 * @param {*} event イベント
 * @return {Promise} テキストメッセージイベントの場合は client.pushMessage() の結果、それ以外は null
 */
async function handleEvent(event) {
  // メッセージイベントではない場合、テキスト以外のメッセージの場合は何も処理しない
  if(event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  
  // 返信用メッセージを組み立てる
  const echoMessage = {
    type: 'text',
    text: `UiPathに「${event.message.text}」と書き込んだよ`
  };
  
  // UiPath実行
  await Util.sendRPA(event.message.text);

  // Reply API を利用してリプライする
  return client.replyMessage(event.replyToken, echoMessage);
}

// サーバを起動する
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});