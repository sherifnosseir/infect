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
var nodeArray=new Array();
fs.readFile('./test.mid', function(err, data) {

	midifile = data;

	//console.log(util.inspect(midifile, false, null));
	//console.log(err);
	process(midifile);
});

function MyCallback(obj) {
	console.log(obj);
	//alert("Done! check your console Log for output dump");
};
var midiObj;
var startTime;
function process(file) {

	//console.log(file);

	midiObj = JSMIDIParser.parse(file);
	//console.log(midiObj);
	var time = 0;
	function sendall(thenode){
		console.log('hello:' + thenode);
		io.sockets.emit('playnote',thenode);
		
	}
	var stime=new Date();
	startTime=stime.getMilliseconds();
	console.log(midiObj.track[1].event.length);
	for ( n = 0; n < midiObj.track[1].event.length - 1; n++) {
		console.log("type:"+midiObj.track[1].event[n].type);
		if (midiObj.track[1].event[n].type == 8 || midiObj.track[1].event[n].type == 9) {
			var note=midiObj.track[1].event[n].data[0];
			nodeArray.push(note);
			setTimeout(function(){sendall(nodeArray.pop());} , time*12);
			time = time + midiObj.track[1].event[n].deltaTime;
		}
		//console.log(time);
		//console.log(n);
		//console.log(t);
	}

	//process(midifile);

	io.sockets.on('connection', function(socket) {
		socket.on('connect',function(){
			socket.emit('loadfile',midiObj);
		});
		socket.on('ready',function(){
			var cdate=new Date();
			ctime=cdate.getMilliseconds-startTime;
			socket.emit('currenttime',ctime);
		});

		socket.on('my other event', function(data) {
			console.log(data);
		});
		socket.on('play', function(playedNote) {
			socket.broadcast.emit('playnote', playedNote);
		})
	});

}

