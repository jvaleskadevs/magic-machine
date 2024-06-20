// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract PruneMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        address machineAddress = address(0x585077dEa6FBcDEbAA0D405756B7D3645b00e977);
        address deployer = address(0x26281BB0b775A59Db0538b555f161E8F364fd21e);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        uint256[] memory indexes = new uint256[](1);
    
        vm.startBroadcast(vm.envUint("PK"));
        
        console.log(mm.machine(0));
        //mm.pruneMachine(indexes);
        //mm.withdraw(deployer);
        mm.distributeRandomItem{value: mm.price()}();
        for (uint i = 0; i < 69; i++) {
            console.log(mm.machine(i));
        }
    }
}
