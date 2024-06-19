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
        address machineAddress = address(0x5Fc398E3B7bd56340d949030Fc396fC92758aFC8);
        //address nftAddress = address(0x1A77fc9E7F2b95399497dCDBE82a030B9F05a9aD);
        address deployer = address(0x26281BB0b775A59Db0538b555f161E8F364fd21e);
    
        vm.startBroadcast(vm.envUint("PK"));
        
        MagicMachine mm = MagicMachine(machineAddress);
        NFT nft = new NFT(deployer);
        NFT1155 nft1155 = new NFT1155(deployer);

        address[] memory addresses = new address[](6);
        uint256[] memory tokenIds = new uint256[](6);  
        
        for (uint i = 0; i < 3; i++) {
            nft.safeMint(deployer, "");
            nft.approve(machineAddress, i);
            nft1155.mint(deployer, i, 1, "");
            
            //nft.safeTransferFrom(address(0x26281BB0b775A59Db0538b555f161E8F364fd21e), address(0x1b8B03327D0a2b2e222BCE579664311617f013d7), i);

            addresses[i] = address(nft);
            addresses[i+3] = address(nft1155);
            tokenIds[i] = i;       
            tokenIds[i+3] = i;      
        }
        nft1155.setApprovalForAll(machineAddress, true);
        
        mm.deposit(addresses, tokenIds, true);
        
        console.log(mm.machine(2));
        console.log(mm.machine(3));
        console.log(mm.totalNfts());
        console.log(mm.lastMappingIndex());
        
        //mm.distributeRandomItem{value: mm.price()}();
    }
}