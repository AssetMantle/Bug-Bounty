<div align="center">
  <h1>Node</h1>

![GitHub Workflow Status](https://github.com/assetmantle/node/actions/workflows/test.yml/badge.svg)
[![Go Report Card](https://goreportcard.com/badge/github.com/assetmantle/node)](https://goreportcard.com/report/github.com/assetmantle/node)
[![License: Apache-2.0](https://img.shields.io/github/license/assetmantle/node.svg)](https://github.com/assetmantle/node/blob/main/LICENSE)
[![Lines Of Code](https://img.shields.io/tokei/lines/github/assetmantle/node)](https://github.com/assetmantle/node)
[![Version](https://img.shields.io/github/tag/assetmantle/node.svg?cacheSeconds=3600)](https://github.com/assetmantle/node/latest)

</div>

Application implementing the minimum clique of AssetMantle modules enabling interNFT definition, issuance, ownership
transfer and decentralized exchange.

## Hardware Requirements

* **Minimal**
  * 1 GB RAM
  * 50 GB HDD
  * 1.4 GHz CPU
* **Recommended**
  * 2 GB RAM
  * 100 GB HDD
  * 2.0 GHz x2 CPU

> NOTE: SSDs have limited TBW before non-catastrophic data errors. Running a full node requires a TB+ writes per day, causing rapid deterioration of SSDs over HDDs of comparable quality.

## Operating System

* Linux/Windows/MacOS(x86)
* **Recommended**
* Linux(x86_64)

## How to use JMeter and testnet

>https://github.com/AssetMantle/node/blob/AssetMantle/BugBounty/.jmeter/SuccessfulFlow.jmx contains the jmeter script used for testing

>Please note that the IP and PORT are set to your localhost by default, to use it on testnet, change each protocol from http to https and IP to restnet.testnet.assetmantle.one, PORT should be blank.

>You may try different types of inputs and record any failures that are unexpected, each request shows the exact body required to carry out transactions, please feel free to send them separately as POST requests if required

>the FAUCET request in jmeter requires a running node which can carry out a simple send tx, you can use https://testnet.faucet.assetmantle.one/{address}

## Installation Steps

>Prerequisite: go1.14+ required. [ref](https://golang.org/doc/install)
>Prerequisite: git. [ref](https://github.com/git/git)
>Optional requirement: GNU make. [ref](https://www.gnu.org/software/make/manual/html_node/index.html)

* Clone git repository

```shell
git clone https://github.com/AssetMantle/node.git
```

* Checkout release tag

```shell
git fetch --tags
git checkout [vX.X.X]
```

* Install

```shell
cd AssetMantle/node
make install
```
### Setup script
https://github.com/AssetMantle/node/blob/master/.script/setup.sh can be used to setup the chain, afterwards you just need to run it
The following steps are for those who wish to use CLI commands directly to run the chain

### Generate keys

`mantleNode keys add [key_name]`

or

`mantleNode keys add [key_name] --recover` to regenerate keys with your [BIP39](https://github.com/bitcoin/bips/tree/master/bip-0039) mnemonic

### Initialize a new chain and start node

* Initialize: `mantleNode init [node_name] --chain-id [chain_name]`
* Add key for genesis account `mantleNode keys add [genesis_key_name]`
* Add genesis account `mantleNode add-genesis-account [genesis_key_name] 10000000000000000000stake`
* Create a validator at genesis `mantleNode gentx [genesis_key_name] 10000000stake --chain-id [chain_name]`
* Collect genesis transactions `mantleNode collect-gentxs`
* Start node `mantleNode start`

### Reset chain

```shell
rm -rf ~/.mantleNode
```

### Shutdown node

```shell
killall mantleNode
```

### Check version

```shell
mantleNode version
```
### Walkthrough
Please go through all JMeter transactions carefully, they explain the whole flow and show how requests are to be sent

AssetMantle/node/.rest and AssetMantle/node/.run contain sample rest requests and run configurations for the project

mantleNode tx [module_name] --help can be used to find all possible transactions for a given module

Modules are all available under AssetMantle/modules/modules

All the transaction messages and request formats are available under AssetMantle/modules/modules/[module_name]/internal/transactions/[transaction_name]

They can be used to check which inputs are required for each transaction

## Containeirzed environment

> Make sure you have latest docker version, Docker for mac can be [slow](https://twitter.com/pratikbin/status/1570722135571861504). Recommend using linux

Start node and client

```shell
# port 26657 and 1317 are exposed
make docker-compose
```

### clean

```shell
make docker-clean
```

<div align="center">

[![Discord](https://dcbadge.vercel.app/api/server/8tSZ2NPSnS)](https://discord.gg/8tSZ2NPSnS)
[![Twitter](https://img.shields.io/twitter/follow/AssetMantle?color=blue&label=Twitter&style=for-the-badge&cacheSeconds=3600&logo=twitter)](https://twitter.com/AssetMantle)
[![Reddit](https://img.shields.io/reddit/subreddit-subscribers/AssetMantle?style=for-the-badge&cacheSeconds=3600&logo=reddit&label=Reddit%20r/assetmantle&logoColor=white)](https://www.reddit.com/r/AssetMantle/)
[![YouTube](https://img.shields.io/youtube/channel/subscribers/UCQkov-0kol99KGMxyXc-a6Q?label=YouTube&cacheSeconds=3600&logoColor=red&style=for-the-badge&logo=YouTube)](https://www.youtube.com/channel/UCQkov-0kol99KGMxyXc-a6Q/videos)

</div>

<div align="center">
    <div style="display:flex; justify-content:space-around;">
        <h3 style="margin:-5px 10px 5px;">Contributors</h3>
        <hr align="left" width="20%">
    </div>
    <img src="https://contrib.rocks/image?repo=assetmantle/node&columns=80" width="70%" height="70%"/>
</div>
