// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract ResetMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        //address machineAddress = address(0xf42d8aa36a328ef5a44D37ae9B035Aa5BE47764a); // baseSepolia
        address machineAddress = address(0x38529794394959DD2b2db3edDF9b04ed5D407573); // zoraSepolia
        //address deployer = address(0xA9fD03e154e1B3Cbe88F1b515E7EbDAb2d640b60);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        vm.startBroadcast(vm.envUint("PK"));
        
        mm.resetMachine(true);
    }
}
