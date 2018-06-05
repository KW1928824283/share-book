var express = require('express')
var app = express()
var fs = require('fs')
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){  
    
});



//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
var  usocket = {}
io.on('connection', function(socket){
	console.log('a user connected');
	socket.emit("message","connected")
//	console.log(socket)
	//监听新用户加入
	socket.on('login', function(obj){
		console.log(obj)
		//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		socket.name = obj.uid;

		//检查在线列表，如果不在里面就加入
		if(!onlineUsers.hasOwnProperty(obj.uid)) {
			onlineUsers[obj.uid] = obj.nickName;
			usocket[obj.uid] = socket
			//在线人数+1
			onlineCount++;
		}
		
		//向所有客户端广播用户加入
		
		console.log(obj.nickName+'加入了聊天室');
		console.log("onlineUsers:")
		console.log(onlineUsers)
	});
	
	//监听用户退出
	socket.on('disconnect', function(){
		console.log(onlineUsers)
		console.log("before")
		//将退出的用户从在线列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//退出用户的信息
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			//删除
			delete onlineUsers[socket.name];
			delete usocket[socket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+'退出了聊天室');
		}
		console.log("after")
		console.log(onlineUsers)
	});
	
	
	
	socket.on('addFriReq',function(msg){
		console.log(msg)
		if(onlineUsers.hasOwnProperty(msg.resUid)){
			usocket[msg.resUid].emit('addFriReqS',msg)
			var ret = {
				status:false
			}
			usocket[msg.reqUid].emit('addFriReqLoginout',ret)
		}else{
			console.log("logined")
			msg.status = true
			usocket[msg.reqUid].emit('addFriReqLoginout',msg)
		}
	})
	socket.on('retBookReq',function(obj){
		console.log(obj)
		if(onlineUsers.hasOwnProperty(obj.reqUid)){
			usocket[obj.reqUid].emit('retReq',obj)
			var ret = {
				status:false
			}
			usocket[obj.resUid].emit('retLoginout',ret)
		}else{
			obj.status = true
			usocket[obj.resUid].emit('retLoginout',obj)
		}
	})
	socket.on('lendBookReq',function(obj){
		console.log(obj)
		if(onlineUsers.hasOwnProperty(obj.resUid)){
			usocket[obj.resUid].emit('lendReq',obj)
			var ret = {
				status:false
			}
			usocket[obj.reqUid].emit('lendLoginout',ret)
		}else{
			obj.status = true
			usocket[obj.reqUid].emit('lendLoginout',obj)
		}
		
	})
	socket.on('lendFriRes',function(obj){
		console.log(obj)
		if(onlineUsers.hasOwnProperty(obj.reqUid)){
			usocket[obj.reqUid].emit('lendFriResS',obj)
		}
	})
	socket.on('retFriRes',function(obj){
		console.log(obj)
		if(onlineUsers.hasOwnProperty(obj.resUid)){
			usocket[obj.resUid].emit('retFriResS',obj)
		}
	})
	
	
	
	//监听用户发布聊天内容
	socket.on('message', function(obj){
		//向所有客户端广播发布的消息
	
		usocket['ll'].emit('message',obj)
		usocket[obj.username].emit('message',obj)
//		io.emit('message', obj);
		console.log(obj.username+'说：'+obj.content);
	});
	
	socket.on('addFriRes',function(obj){
		console.log(obj)
		
		if(onlineUsers.hasOwnProperty(obj.reqUid)){
			usocket[obj.reqUid].emit('addFriResS',obj)
		}
	});
	
	socket.on('add user',function(obj){
		console.log(obj)
		io.emit('login','succcess')
	})
	
	socket.on('new message',function(obj){
		console.log(obj)
		io.emit('new message',obj)
	})
	socket.on('addfriend',function(obj){
		console.log(obj)
		io.emit('friend agree',obj)
	})
	
	
	
  
});

http.listen(3000, function(){
	console.log('listening on *:80');
});