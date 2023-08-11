package com.troopapi.Troopapi.dao;

import com.troopapi.Troopapi.entities.payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface paymentDao extends JpaRepository<payment, Integer> {
}
