// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NFT} from "../src/utils/NFT.sol";
import {MagicMachine} from "../src/MagicMachine.sol";
import {NFT1155} from "../src/utils/NFT1155.sol";

contract MintNFTsScript is Script {
    function setUp() public {
    
    }

    function run() public {
        address machineAddress = address(0xf42d8aa36a328ef5a44D37ae9B035Aa5BE47764a);
        //address nftAddress = address(0x2ACDEe0636B57961f007ac74EfFCb76ad60A33D4);
        address deployer = address(0x26281BB0b775A59Db0538b555f161E8F364fd21e);
    
        vm.startBroadcast(vm.envUint("PK"));
        
        MagicMachine mm = MagicMachine(machineAddress);
        NFT nft = new NFT(deployer);
        NFT1155 nft1155 = new NFT1155(deployer);

        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);  
        
        for (uint i = 0; i < 4; i++) {
            nft.safeMint(deployer, "");
            nft.approve(machineAddress, i);
            nft1155.mint(deployer, i, 1, "");

            addresses[i] = address(nft);
            addresses[i+4] = address(nft1155);
            tokenIds[i] = i;       
            tokenIds[i+4] = i;      
        }
        nft1155.setApprovalForAll(machineAddress, true);
        
        mm.deposit(addresses, tokenIds, true);
        
        console.log(mm.totalNfts());
        console.log(mm.lastMappingIndex());
        
        //mm.distributeRandomItem{value: mm.price()}();
    }
}
