const express = require('express');
const fetch = require('node-fetch');
// const { exec } = require('child_process'); // ytdlp使えんかったからコメントアウトしときます…
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/watch', (req, res) => {
  res.sendFile(__dirname + '/public/watch.html');
});

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: '検索クエリが必要です。' });
  }
  try {
    const invidiousInstance = 'https://lekker.gay'; 
    const response = await fetch(`${invidiousInstance}/api/v1/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Invidious検索APIエラー:', error);
    res.status(500).json({ error: '検索中にエラーが発生しました。' });
  }
});

//api設定めんどくさい
app.get('/api/video/:videoId', async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const response = await fetch(`https://twisty-oasis-vinyl.glitch.me/api/${videoId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Glitch動画情報APIエラー:', error);
    res.status(500).json({ error: '動画情報の取得中にエラーが発生しました。' });
  }
});
//コメントってこれでできるんか、わかめありがとう

app.get('/api/comments/:videoId', async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const invidiousInstance = 'https://lekker.gay'; 
    const response = await fetch(`${invidiousInstance}/api/v1/comments/${videoId}`);
    if (!response.ok) {
        if (response.status === 404) {
            return res.status(200).json({ comments: [] });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('InvidiousコメントAPIエラー:', error);
    res.status(500).json({ error: 'コメントの取得中にエラーが発生しました。' });
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`サーバーがポート ${process.env.PORT || port} で起動しました。`);
});;
