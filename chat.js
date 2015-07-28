var net = require('net');
var chalk = require('chalk');

var port = 3000;


var clientsConnected = 0;
var clients = [];

var history = [];

var server = net.createServer(function(c){
  c.id = clientsConnected;
  // clients.push(c);
  clientsConnected++;

  c.write(history.join(""));
  c.write("Please enter a username:\r\n")

  var step = 1;
  c.on('data', function(data){
    var input = data.toString().trim();

    switch (step){
      case 1:
        var userName = input;
        c.userName = userName;
        clients.push(c);
        step++
        c.write("Your user name is "+userName+"\r\n Now you can chat\r\n");
        break;
      case 2:
        var inputAr = input.split(/\s/);
        // console.log(inputAr.splice(0,1)[0]);
        console.log(inputAr);
        if (/\/tableflip/ig.test(inputAr[0])) {
          inputAr.splice(0,1);
          for(var i = 0; i<clients.length; i++){
          if (clients[i] != c) {
            clients[i].write(chalk.underline.cyan(c.userName +" says:")+"(╯°□°）╯︵ ┻━┻"+ inputAr.join("")+ "\r\n");
            };
          };
          history.push(chalk.underline.cyan(c.userName +" says:")+"(╯°□°）╯︵ ┻━┻ "+ inputAr.join("")+ "\r\n");
        } else{
          for(var i = 0; i<clients.length; i++){
            if (clients[i] != c) {
              clients[i].write(chalk.underline.cyan(c.userName +" says:")+ input+ "\r\n");
            };
          };
          history.push(chalk.underline.cyan(c.userName +" says:")+ input+ "\r\n");
        }

        break;
      }


  })



  c.on('end', function(){
    var position = clients.map(function(x){
      return x.id
    }).indexOf(c.id);
    clients.splice(position, 1);
    for(var i = 0; i<clients.length; i++){
    if (clients[i] != c) {
      clients[i].write(chalk.bold.red("client "+ c.userName +" has disconnected\r\n"));
    };
   };
  })
});


server.listen(port, function(){
  console.log("listening on", port);
});


//this is the one on github