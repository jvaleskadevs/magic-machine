// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract PruneMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        address machineAddress = address(0xEFC1d83C9c83433ada878207f4E7690189D17c8C);
        address deployer = address(0xA9fD03e154e1B3Cbe88F1b515E7EbDAb2d640b60);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        uint256[] memory indexes = new uint256[](1);
        indexes[0] = 1;
    
        vm.startBroadcast(vm.envUint("PK"));
        
        //mm.pruneMachine(indexes);
        mm.withdraw(deployer);
        //mm.distributeRandomItem{value: mm.price()}();
        //mm.distributeRandomItem{value: mm.price()}();
        //mm.distributeRandomItem{value: mm.price()}();
        for (uint i = 0; i < 69; i++) {
            console.log(mm.machine(i));
        }
    }
}
