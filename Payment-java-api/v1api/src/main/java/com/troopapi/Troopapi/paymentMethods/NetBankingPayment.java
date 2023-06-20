package com.troopapi.Troopapi.paymentMethods;

import com.cashfree.pg.model.CFNetbanking;
import com.cashfree.pg.model.CFNetbankingPayment;
import com.cashfree.pg.model.CFPaymentMethod;

public class NetBankingPayment {
    public int bankCode = 3022;
    CFNetbanking netBanking = new CFNetbanking()
            .channel("link")
            .netbankingBankCode(bankCode);

    public CFNetbankingPayment netBankingPayment = new CFNetbankingPayment().netbanking(netBanking);
}
