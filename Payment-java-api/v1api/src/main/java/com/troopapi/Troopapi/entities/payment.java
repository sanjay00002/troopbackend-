package com.troopapi.Troopapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class payment {
    @Id
    private int id;
    private double amount;
    private String phone_number;


    public payment(int id, double amount, String phone_number){
        super();
        this.id = id;
        this.amount = amount;
        this.phone_number = phone_number;

    }

    public payment() {
        super();
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getphone_number() {
        return phone_number;
    }

    public void setphone_number(String phone_number) {
        this.phone_number = phone_number;
    }



    @Override
    public String toString() {
        return "payment{" +
                "amount=" + amount +
                ", id=" + id +
                ", phone_number='" + phone_number + '\'' +
                '}';
    }
}
