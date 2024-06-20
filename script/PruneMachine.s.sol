// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract PruneMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        address machineAddress = address(0x88154b8CB1d35FF1a99C06f49b2f6e23914A0C0C);
        //address deployer = address(0x26281BB0b775A59Db0538b555f161E8F364fd21e);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        uint256[] memory indexes = new uint256[](1);
        indexes[0] = 1;
    
        vm.startBroadcast(vm.envUint("PK"));
        
        //mm.pruneMachine(indexes);
        //mm.withdraw(deployer);
        mm.distributeRandomItem{value: mm.price()}();
        for (uint i = 0; i < 69; i++) {
            console.log(mm.machine(i));
        }
    }
}
