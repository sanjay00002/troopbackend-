package com.troopapi.Troopapi.controller;

import com.troopapi.Troopapi.services.walletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1")
public class walletController {
    @Autowired
    private walletService walletService;
    @GetMapping("/updateWallet")
    public String updateWalletStatus(@RequestParam("order_id") String orderId){
        return this.walletService.updateWalletStatus(orderId);
    }
}
