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
	process(midifile);
});

var midiObj;
var startTime;
var trackNum;
var trackAssigned;

function process(file) {

	midiObj = JSMIDIParser.parse(file);

	var time = 0;
	function sendall(thenode){
		console.log('hello:' + thenode);
		io.sockets.emit('playnote',thenode);
	}
	var stime=new Date();//compute start time of the current midi file
	startTime=stime.getMilliseconds();
	
	for ( n = 0; n < midiObj.track[1].event.length - 1; n++) {
		console.log("type:"+midiObj.track[1].event[n].type);
		if (midiObj.track[1].event[n].type == 8 || midiObj.track[1].event[n].type == 9) {
			var note=midiObj.track[1].event[n].data[0];
			nodeArray.push(note);
			//setTimeout(function(){sendall(nodeArray.pop());} , time*12);
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
			if(trackAssigned>=TrackNum)
				socket.emit(-1);
			else()
			socket.emit('currenttime',ctime);
		});

		socket.on('play', function(playedNote) {
			socket.broadcast.emit('playnote', playedNote);
		})
		
		socket.on('user')
	});

}

