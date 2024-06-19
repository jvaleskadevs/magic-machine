// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NFT} from "../src/utils/NFT.sol";
import {MagicMachine} from "../src/MagicMachine.sol";
//import {NFT1155} from "../src/utils/NFT1155.sol";mv

contract MintNFTsScript is Script {
    function setUp() public {
    
    }

    function run() public {
        vm.startBroadcast(vm.envUint("PK"));
        
        MagicMachine mm = MagicMachine(address(0x1b8B03327D0a2b2e222BCE579664311617f013d7));
        NFT nft = NFT(address(0x1A77fc9E7F2b95399497dCDBE82a030B9F05a9aD));
        //NFT1155 nft1155 = new NFT155(address(this));

        address[] memory addresses = new address[](3);
        uint256[] memory tokenIds = new uint256[](3);  
        
        for (uint i = 6; i < 9; i++) {
            nft.safeMint(address(0x26281BB0b775A59Db0538b555f161E8F364fd21e), "");
            nft.approve(address(mm), i);
            //nft.safeTransferFrom(address(0x26281BB0b775A59Db0538b555f161E8F364fd21e), address(0x1b8B03327D0a2b2e222BCE579664311617f013d7), i);
            
          
            addresses[i-6] = (address(nft));
            tokenIds[i-6] = i;
            
        }
        
        //nft1155.mint(recipient, 0, 27, "");

        mm.deposit(addresses, tokenIds, true);
        
        console.log(mm.machine(3));
        //(address addr, uint id) = mm.nfts(1);
        //console.log(addr);
        
        //console.log(mm.machine(3));
        
        console.log(mm.totalNfts());
        console.log(mm.lastMappingIndex());
        
        //console.log(address(0x26281BB0b775A59Db0538b555f161E8F364fd21e).balance);
        //mm.loadMachine();
        mm.distributeRandomItem{value: mm.price()}();
    }
}
