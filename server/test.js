var http = require('http')
http.createServer(function (request,response) {


	response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
	if (request.url != "/favicon.ico") {
		console.log("VISIT")
		response.write("hello,world")
		response.end('hell 世界')

	}
}).listen(3000)
console.log("SEREVR running in localhost:3000")