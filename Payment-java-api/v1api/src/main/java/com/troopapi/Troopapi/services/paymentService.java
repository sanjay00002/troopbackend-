package com.troopapi.Troopapi.services;

import com.cashfree.pg.model.CFLink;
import com.cashfree.pg.model.CFOrderPayData;
import com.troopapi.Troopapi.entities.payment;
import org.json.JSONException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface paymentService {
    public List<payment> getPayments();

    public Optional<payment> getPayment(int payId);

    public String getLink(payment pay) throws IOException, JSONException;
}


