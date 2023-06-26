package com.troopapi.Troopapi.paymentMethods;

import com.cashfree.pg.model.CFUPI;
import com.cashfree.pg.model.CFUPIPayment;

public class UpiPayment {
    public String upiId = "";
    CFUPI upi = new CFUPI()
            .channel(CFUPI.ChannelEnum.LINK)
            .upiId(upiId);

    public CFUPIPayment cfupiPayment = new CFUPIPayment().upi(upi);


}
