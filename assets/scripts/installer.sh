#!/bin/bash

# Functions
setcolor(){
	printf $1
}


resetcolors(){
	printf "\e[39m"
}


checkroot(){
    if [ $(id -u) -ne 0 ]
    then
        setcolor "\e[31m"
        echo "Please run as root user!"
        resetcolors
        exit
    fi
}


# Welcome script
setcolor "\e[36m"
echo "Welcome to chat installer"
resetcolors
checkroot

# Save in vars the mysql credentials
read -p "MySQL user: " user
read -p "MySQL password: " password
read -p "MySQL host: " host


# Create the credentials for mysql in temp file
touch mysql.credentials

echo "[client]" >> mysql.credentials
echo "user = $user" >> mysql.credentials
echo "password = $password" >> mysql.credentials
echo "host = $host" >> mysql.credentials


# Create the chat database
mysql --defaults-extra-file=./mysql.credentials < assets/sql/init.sql


# Remove the temp files
rm -rf mysql.credentials


# Install node dependencies
npm install


# Create script for start nodejs
touch ../../start

chmod 755 start
echo "#!/bin/bash" >> start
echo "echo 'Starting server...' && sleep 1" >> start
echo "npm start" >> start


# Print the installation finished
setcolor "\e[32m"
echo "Installation completed!"
resetcolors
