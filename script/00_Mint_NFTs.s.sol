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
        //address machineAddress = address(0xCaCd62a501991E50b8806a89fB993164b8501212);
        address machineAddress = address(0x4aa3e709758142F47180258167818551C874e2A5);
        //address nftAddress = address(0x6b415D22147bf761f72cD979f8b2C0b67E0978bF);
        address nftAddress = address(0x5B88F2b1E3c6938e30f6B503EeD0F00C4eE1DCCd);
        address deployer = address(0x26281BB0b775A59Db0538b555f161E8F364fd21e);
    
        vm.startBroadcast(vm.envUint("PK"));
        
        MagicMachine mm = MagicMachine(machineAddress);
        //NFT nft = new NFT(deployer);
        //NFT1155 nft1155 = new NFT1155(deployer);

        //NFT nft = new NFT(deployer);
        NFT1155 nft1155 = NFT1155(nftAddress);
        uint totalNfts = 21;

        address[] memory addresses = new address[](totalNfts);
        uint256[] memory tokenIds = new uint256[](totalNfts);  
/*        
        for (uint i = 0; i < 4; i++) {
            nft.safeMint(deployer, "");
            nft.approve(machineAddress, i);
            nft1155.mint(deployer, i, 1, "");

            addresses[i] = address(nft);
            addresses[i+4] = address(nft1155);
            tokenIds[i] = i;       
            tokenIds[i+4] = i;      
        }
*/
        for (uint i = 0; i < totalNfts; i++) {
            addresses[i] = nftAddress;
            tokenIds[i] = 9;
        }

        //nft1155.setApprovalForAll(machineAddress, true);
        
        mm.deposit(addresses, tokenIds, true);
        
        console.log(mm.totalNfts());
        console.log(mm.lastMappingIndex());
        
        //mm.distributeRandomItem{value: mm.price()}();
    }
}
