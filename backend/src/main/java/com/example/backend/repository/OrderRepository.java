package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @Query("select distinct o from Order o join o.items i where i.product.sellerId = ?1 order by o.orderDate desc")
    List<Order> findBySellerIdOrderByOrderDateDesc(Long sellerId);
}
