var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs')
var util = require('util');
var Buffer = require('buffer').Buffer;
app.listen(8080);

require('./JSMIDI/JSMIDIparser.js');

function handler(req, res) {
	fs.readFile(__dirname + req.url, function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

var midifile;
fs.readFile('./test.mid', function (err, data) {
  
  
  midifile=data;
  
  //console.log(util.inspect(midifile, false, null));
  console.log(err);
  process(midifile);
});


function MyCallback(obj){
			console.log(obj);
			//alert("Done! check your console Log for output dump");
		};
		
function process(file) {
		
		//console.log(file);
		
		var t=JSMIDIParser.parse(file);
		console.log(t);
	}
//process(midifile);
io.sockets.on('connection', function(socket) {
	socket.emit('news', {
		hello : 'world'
	});
	socket.on('my other event', function(data) {
		console.log(data);
	});
	

	socket.on('play', function() {
		socket.broadcast.emit('playnote', 90);
	})
	

}); 
