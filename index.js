require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');
const shortid = require('shortid');
var bodyParser = require('body-parser');

const app = express();


const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const shortUrls = {};

app.post('/api/shorturl', (req, res) => {
  console.log(req.body)
  originalUrl = req.body.url

  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  };

  const shortUrl = shortid.generate();
  shortUrls[shortUrl] = originalUrl;
  res.json({ 
    original_url: originalUrl, 
    short_url: shortUrl 
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  console.log(req.params)
  const originalUrl = shortUrls[req.params.short_url]

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'short url not found' });
  };
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
