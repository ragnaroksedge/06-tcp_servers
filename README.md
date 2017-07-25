## TCP Chat Server

This is a basic TCP chat server that allows users to connect and send messages. Each user is assigned a nickname and unique id. The nickname may be changed. 

- To join the chat server, type: telnet 172.16.3.81 3000

### Commands
- @all (message) sends a message to all users.
- @whisper (nickname) (message) sends a direct message to a specified user.
- @shout (message) shouts an allcaps message to all users.
- @nickname (nickname) changes user's nickname.
