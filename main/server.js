const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();

// 'public' 폴더를 정적 파일을 서빙할 디렉토리로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로로 접근하면 'mainindex.html' 파일을 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mainindex.html'));
});

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/mosiduswb.site/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mosiduswb.site/fullchain.pem')
};

// HTTPS 서버 포트 443으로 설정
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS Server is running on https://localhost:443');
});
