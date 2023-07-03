package com.troopapi.Troopapi.services;
import com.troopapi.Troopapi.dao.paymentDao;
import com.troopapi.Troopapi.entities.payment;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import okhttp3.*;


@Service
public class paymentServiceImpl implements paymentService{

    @Value("${clientId}")
    private String clientId;

    @Value("${clientSecret}")
    private String clientSecret;

    @Autowired
    private paymentDao payDao;

    @Override
    public List<payment> getPayments() {
        return this.payDao.findAll();
    }

    @Override
    public Optional<payment> getPayment(int payId) {
        return this.payDao.findById(payId);
    }

    @Override
    public String getLink(payment pay) throws IOException, JSONException {
        this.payDao.save(pay);

        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();

        String customerPhone = pay.getphone_number();
        String customerName = "test";
        String customerEmail = "a@gmail.com";
        String linkId = UUID.randomUUID().toString();
        int linkAmount = (int) pay.getAmount();
        String linkCurrency = "INR";
        String linkPurpose = "1888838888883";        
        String returnUrl  = "http://localhost:8080/v1/updateWallet?link_id="+linkId+"&wallet_id="+pay.getId();
        boolean linkAutoReminders = true;
        boolean linkPartialPayments = true;
        int linkMinimumPartialAmount = 25;

        // Construct the JSON string with variables
        String jsonBody = String.format(
                "{\n" +
                        "    \"customer_details\": {\n" +
                        "        \"customer_phone\": \"%s\",\n" +
                        "        \"customer_name\": \"%s\",\n" +
                        "        \"customer_email\": \"%s\"\n" +
                        "    },\n" +
                        "    \"link_notify\": {\n" +
                        "        \"send_sms\": false,\n" +
                        "        \"send_email\": false\n" +
                        "    },\n" +
                        "    \"link_notes\": {},\n" +
                        "    \"link_meta\": {\n" +
                        "        \"notify_url\": \"\",\n" +
                        "        \"upi_intent\": false,\n" +
                        "        \"return_url\": \"%s\"\n" +
                        "    },\n" +
                        "    \"link_id\": \"%s\",\n" +
                        "    \"link_amount\": \"%d\",\n" +
                        "    \"link_currency\": \"%s\",\n" +
                        "    \"link_purpose\": \"%s\",\n" +
                        "    \"link_auto_reminders\": %b,\n" +
                        "    \"link_partial_payments\": %b,\n" +
                        "    \"link_minimum_partial_amount\": %d\n" +
                        "}",
                customerPhone, customerName, customerEmail, returnUrl, linkId, linkAmount, linkCurrency,
                linkPurpose, linkAutoReminders, linkPartialPayments, linkMinimumPartialAmount);


        MediaType mediaType = MediaType.parse(" application/json");
        RequestBody body = RequestBody.create(mediaType,jsonBody);


        Request request = new Request.Builder()
                .url("https://sandbox.cashfree.com/pg/links")
                .method("POST", body)
                .addHeader("Accept", " application/json")
                .addHeader("Content-Type", " application/json")
                .addHeader("x-api-version", " 2022-09-01")
                .addHeader("x-client-id", this.clientId)
                .addHeader("x-client-secret", this.clientSecret)
                .build();

        try{
            Response response = client.newCall(request).execute();
            String rbody = response.body().string();
            JSONObject Jobject = new JSONObject(rbody);
//            System.out.println(Jobject);
            return Jobject.getString("link_url").toString();
        }catch(Exception e){
            System.out.println(e.getMessage());
            return "Payment Failed";
        }
    }
}

