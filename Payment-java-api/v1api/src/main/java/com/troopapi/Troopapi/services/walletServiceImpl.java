package com.troopapi.Troopapi.services;

import com.cashfree.pg.ApiResponse;
import com.cashfree.pg.gatewayinterface.CFConfig;
import com.cashfree.pg.gatewayinterface.CFHeaders;
import com.cashfree.pg.gatewayinterface.CFPaymentGatewayService;
import com.cashfree.pg.model.CFOrder;
import com.troopapi.Troopapi.dao.walletDao;
import com.troopapi.Troopapi.entities.wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.Objects;

@Service
public class walletServiceImpl implements walletService {

    @Autowired
    private walletDao walletDao;
    @Override
    public String updateWalletStatus(@RequestParam("order_id") String orderId) {
        CFConfig config = CFConfig.builder()
                .ClientId("TEST40437759704009880a29007d61773404")
                .ClientSecret("TEST95536982c0ad8e1ed3febb0de32ed675c6c0236")
                .ApiVersion("2022-09-01")
                .Environment(CFConfig.CFEnvironment.SANDBOX)
                .build();

        CFHeaders headers = CFHeaders.builder().build();
        CFPaymentGatewayService apiInstance = new CFPaymentGatewayService();
        try{
            ApiResponse<CFOrder> orderStatus = apiInstance.getOrder(config,headers,orderId);
            String status = orderStatus.getData().getOrderStatus();
            BigDecimal amount = orderStatus.getData().getOrderAmount();

            if(Objects.equals(status, "PAID")){
                wallet w = new wallet();
                w.setId(1);
                w.setBalance(amount);
                this.walletDao.save(w);
                return "Amount Added to Wallet";
            }

            return "Wallet is not updtaed";

        }catch(Exception e){
            System.err.println("Exception when calling OrdersApi#createOrder");
            e.printStackTrace();
            return "Error";
        }

    }
}
