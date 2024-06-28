// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract StateMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        address machineAddress = address(0xC2f8e346f3C50968358b0f06E77b1F49559f1EBa); // baseSepolia
        //address machineAddress = address(0x38529794394959DD2b2db3edDF9b04ed5D407573); // zoraSepolia
        //address deployer = address(0xA9fD03e154e1B3Cbe88F1b515E7EbDAb2d640b60);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        //vm.startBroadcast(vm.envUint("PK"));
        
        console.log(mm.lastMappingIndex());
        console.log(mm.totalNfts());
        console.log(mm.totalNftsMachine());
        
        for (uint i = 0; i < 69; i++) {
            console.log(mm.machine(i));
        }
    }
}
