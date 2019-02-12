#!/bin/sh

set -x  # print all executed commands to the terminal

# Install NVM
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
#. ~/.bash_profile
#nvm install 8.11.1
#nvm alias default 8.11.1

# Login to expo
##expo login -u $EXP_USERNAME -p $EXP_PASSWORD

## Prepare detached build
##exp prepare-detached-build --platform ios
##exp bundle-assets --platform ios
##expo path

# Deploy to the right release channel
##expo publish --release-channel $EXP_RELEASE_CHANNEL

# Login to expo
yarn run expo login -u $EXP_USERNAME -p $EXP_PASSWORD

# Deploy to the right release channel
yarn run expo publish --release-channel $EXP_RELEASE_CHANNEL
