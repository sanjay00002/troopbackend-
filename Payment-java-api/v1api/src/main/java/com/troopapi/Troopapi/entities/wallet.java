package com.troopapi.Troopapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
public class wallet {
    @Id
    private int id;
    private BigDecimal balance;

    public wallet(int id, BigDecimal balance) {
        super();
        this.id = id;
        this.balance = balance;
    }

    public wallet(){
        super();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "wallet{" +
                "id=" + id +
                ", balance=" + balance +
                '}';
    }
}
