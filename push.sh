#!/bin/bash
if [ "$1" == "dev" ]; then
  SERVER="120.132.21.52"
  PUB="apm-dev"
fi

if [ "$1" == "uat" ]; then
  SERVER="120.132.8.152"
  PUB="apm-uat"
fi

if [ "$1" == "sit" ]; then
  SERVER="120.132.8.142"
  PUB="apm-prod"
fi

echo push to $SERVER...

# scp -i ~/.ssh/$PUB -r build/* root@$SERVER:/var/www/html/dashboard
rsync -Pav -e "ssh -i ~/.ssh/$PUB" build/* root@$SERVER:/var/www/html/dashboard

echo clean up...
echo done.