package com.troopapi.Troopapi.controller;

import com.cashfree.pg.model.CFOrderPayData;
import com.troopapi.Troopapi.entities.payment;
import com.troopapi.Troopapi.services.paymentService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1")

public class controller {
    @Autowired
    private paymentService paymentService;

    @GetMapping("/")
    public String home(){
        return "Hello Troop";
    }

    // @GetMapping("/payments")
    // public List<payment> getPayments(){
    //     return  this.paymentService.getPayments();
    // }

    // @GetMapping("/payments/{payId}")
    // public Optional<payment> getPayment(@PathVariable String payId){
    //     return this.paymentService.getPayment(payId);
    // }


    @PostMapping("/getLink")
    public String getLink(@RequestBody payment pay) throws IOException, JSONException {
        return this.paymentService.getLink(pay);
    }

}
