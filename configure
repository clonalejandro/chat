#!/bin/bash

# Functions
setcolor(){
	printf $1
}


resetcolors(){
	printf "\e[39m"
}


checkroot(){
    if [ $(id -u) -ne 0 ]; then
        setcolor "\e[31m"
        echo "Please run as root user!"
        resetcolors
        exit
    fi
}


#Welcome script
setcolor "\e[35m"
echo "Welcome to configuration!!"
resetcolors
checkroot

# Main vars
debug="none"
fileconfig="../data/config.json"


# Reset the last config
rm -rf $fileconfig


# Save the parameters in vars
while [ $debug != "true" ] && [ $debug != "false" ]; do
	read -p "Debug mode (true/false): " debug
done

read -p "Server port: " port
read -p "Api key: " apikey
read -p "Logo URL: " logo
read -p "Website name: " webname
read -p "Website description: " description
read -p "Website tags separated by comas: " tags
read -p "Contact email: " email
read -p "Website URL: " weburi
read -p "Session secret key: " secret
read -p "Session resave: " resave
read -p "Session save uninitialized: " saveunitialized
read -p "MySQL host: " host
read -p "MySQL user: " user
read -p "MySQL password: " password


# Create the file config
touch $fileconfig

echo "{" >> $fileconfig
echo "	\"debug\": $debug," >> $fileconfig
echo "	\"port\": $port," >> $fileconfig
echo "	\"apiKey\": \"$apikey\"," >> $fileconfig
echo "	\"logo\": \"$logo\"," >> $fileconfig
echo "	\"webName\": \"$webname\"," >> $fileconfig
echo "	\"description\": \"$description\"," >> $fileconfig
echo "	\"tagsString\": \"$tags\"," >> $fileconfig
echo "	\"email\": \"$email\"," >> $fileconfig
echo "	\"webURI\": \"$weburi\"," >> $fileconfig
echo "	\"db\": \"chat\"," >> $fileconfig
echo "  \"session\": {" >> $fileconfig
echo "		\"secret\": \"$secret\"," >> $fileconfig
echo "		\"resave\": $resave," >> $fileconfig
echo "		\"saveUninitialized\": $saveunitialized" >> $fileconfig
echo "  }," >> $fileconfig
echo "	\"mysql\": {" >> $fileconfig
echo "		\"host\": \"$host\"," >> $fileconfig
echo "		\"user\": \"$user\"," >> $fileconfig
echo "		\"password\": \"$password\"" >> $fileconfig
echo "	}" >> $fileconfig
echo "}" >> $fileconfig


# End script
setcolor "\e[32m"
echo "Configuration completed!"
resetcolors