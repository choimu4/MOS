const express = require('express');
const path = require('path');
const app = express();

// 'public' 폴더를 정적 파일을 서빙할 디렉토리로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로로 접근하면 'mainindex.html' 파일을 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mainindex.html'));
});

// 서버 포트 8080으로 설정
app.listen(80, () => {
    console.log('Server is running on http://localhost:80');
});
