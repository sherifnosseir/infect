var app = require('http').createServer(handler), io = require('socket.io').listen(app,{log:false}), fs = require('fs')
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

fs.readFile('./test2.mid', function(err, data) {
	midifile = data;
	process(midifile);
});

var midiObj;
var startTime;
var tracksNum=new Array();
var trackAssigned;

function process(file) {

	midiObj = JSMIDIParser.parse(file);
	tracksNum=new Array();
	trackAssigned=0;
	
	for(var i=0;i<midiObj.track.length;i++){
		if(midiObj.track[i].event.length>50){
			tracksNum.push(i);
		}
	}

	
	/*function sendall(thenode){
		console.log('hello:' + thenode);
		io.sockets.emit('playnote',thenode);
	}*/
	var stime=new Date();//compute start time of the current midi file
	startTime=stime.getTime();
	console.log('startTime'+startTime);
	/*
	for ( n = 0; n < midiObj.track[1].event.length - 1; n++) {
		//console.log("type:"+midiObj.track[1].event[n].type);
		if (midiObj.track[1].event[n].type == 8 || midiObj.track[1].event[n].type == 9) {
			var note=midiObj.track[1].event[n].data[0];
			nodeArray.push(note);
			//setTimeout(function(){sendall(nodeArray.pop());} , time*12);
			time = time + midiObj.track[1].event[n].deltaTime;
		}
		//console.log(time);
		//console.log(n);
		//console.log(t);
	}*/

	//process(midifile);

	io.sockets.on('connection', function(socket) {
		socket.on('connect',function(){
			socket.emit('loadfile',midiObj,tracksNum);
		});
		socket.on('ready',function(){
			var cdate=new Date();
			
			ctime=cdate.getTime()-startTime;
			var trackNo=-1;
			console.log(ctime);
			if(trackAssigned>=(tracksNum.length-1))
				trackNo=-1;
			else{
				trackNo=trackAssigned;
				trackAssigned++;
				
			}
				
		
			socket.emit('currenttime',ctime,trackNo);
		});

		socket.on('play', function(playedNote) {
			socket.broadcast.emit('playnote', playedNote);
		});
		
		socket.on('userPlay',function(delay,trackNo){
			socket.broadcast.emit('setDelay',delay,trackNo);
		});
		//socket.on('user')
	});

}

