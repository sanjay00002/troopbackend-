package com.troopapi.Troopapi.paymentMethods;

import com.cashfree.pg.model.CFCard;
import com.cashfree.pg.model.CFCardPayment;
//import org.example.model.Customer;

public class CardPayment {
    public String cardNumber= "6074825972083818";
    public String cardHolderName = "Test";
    public String cardExpiryMm = "03";
    public String cardExpiryYy = "28";
    public String cardCvv = "123";

//    Card save logic will go here only

    CFCard card = new CFCard()
            .channel("link")
            .cardNumber(cardNumber)
            .cardHolderName("")
            .cardHolderName(cardHolderName)
            .cardExpiryMm(cardExpiryMm)
            .cardExpiryYy(cardExpiryYy)
            .cardCvv(cardCvv);
//            .instrumentId("")
//            .cardAlias("")
//            .cryptogram("")
//            .tokenRequestorId("")
//            .cardBankName(CFCard.CardBankNameEnum.KOTAK)
//            .cardDisplay("")
//            .emiTenure(1);
    public CFCardPayment cfcardPayment = new CFCardPayment().card(card);
}
