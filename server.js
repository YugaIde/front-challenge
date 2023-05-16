// import { IncomingWebhook } from '@slack/webhook'

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // CORSミドルウェアを追加

app.post('/api/sendMessage', async (req, res) => {
  try {
const webhookUrl = 'https://hooks.slack.com/services/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'; // Incoming WebhooksのURLに置き換えてください

    const payload = {
    //   channel: 'C057V81UEAZ', // メッセージを送信したいチャンネルのIDまたは名前を指定
      text: `名前: ${req.body.name}\nコンテンツ: ${req.body.content}`,
    };

    // Slack Incoming Webhooksにリクエストを送信
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      // リクエストが成功した場合の処理
      res.sendStatus(200);
    } else {
      // リクエストが失敗した場合の処理
      res.status(response.status).json({ error: 'Slackへのメッセージ送信に失敗しました' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// CORSヘッダーを設定するエンドポイントを追加
app.options('/api/sendMessage', cors());

app.listen(5001, () => {
  console.log('サーバーがポート5001で起動しました');
});
