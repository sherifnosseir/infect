var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '209.141.61.27');
console.log('Server running at http://http://209.141.61.27/:1337/');