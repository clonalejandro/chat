# CHAT ONLINE [WIP]
A chat with nodejs and sockets with socket.io and express, mysql..

### How to install?
* You can install manually executing: `sudo npm i` 
    * Configure the config located in `/assets/data/config.json` 
    * You need to execute the init sql script located in `/assets/data/sql/init.sql` with this command for mysql database: `mysql -uroot -p1234 < /assets/sql/init.sql`
* You can install graphically executing with: `chmod 755 installer && sudo ./installer`
    * Configure executing: `chmod 755 configure && sudo ./configure`

### How to run chat server?
* You can run the server executing `npm start`
* Also you can run the server executing `chmod 755 start && sudo ./start`

### Where is logs?
When you run the server for first time the chat creates in the folder installed a new folder called "Logs".
