#!/bin/bash
cd /home/cos/spaceSim
git reset --hard
git pull
yarn install
yarn build
