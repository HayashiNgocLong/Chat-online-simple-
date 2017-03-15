var express= require('express');
var app= express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
user=[];
connections=[];

server.listen(process.env.PORT||3000);
console.log("Server listen in port 3000")

//link to view
app.get('/',function(req,res){
    res.sendfile(__dirname+'/index.html');
});

io.sockets.on('connection',socket=>{
    //Connect
    connections.push(socket);
    console.log('Connected: %s socket connected',connections.length);

socket.on('disconnect',data=>{
 //Disconnect
 
 user.splice(user.indexOf(socket.username),1);
 updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnect: %s socket connected',connections.length);
    
});

//Send MEssage
socket.on('sendmessage',data=>{
    
    io.sockets.emit('newmessage',{msg:data,users:socket.username});
});
//New user
socket.on('newuser',(data,callback)=>{
    callback(true);
    socket.username=data;
    user.push(socket.username);
    updateUsernames();

});

function updateUsernames(){
    io.sockets.emit('getusers',user)
}
   

})