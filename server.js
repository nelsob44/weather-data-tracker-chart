const express = require('express');

const app = express();

app.use(express.static('./dist/weather-data'));

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'dist/weather-data' }
  );
});

app.listen(process.env.PORT || 8080);