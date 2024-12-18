package com.marketmatch.appdev.BackEnd.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "seller_id", nullable = false)
    private SellerEntity seller;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    private Integer quantity;
    private Double totalPrice;
    private String status; // 'complete', 'canceled', etc.
    private LocalDateTime transactionDate;
    private String canceledBy; // Who canceled the transaction, if applicable

    
    public SHistoryEntity() {
        super();
    }
    public SHistoryEntity(Long id, SellerEntity seller, ProductEntity product, Integer quantity, Double totalPrice,
            String status, LocalDateTime transactionDate, String canceledBy) {
        this.id = id;
        this.seller = seller;
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.transactionDate = transactionDate;
        this.canceledBy = canceledBy;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    // public SellerEntity getSeller() {
    //     return seller;
    // }
    public void setSeller(SellerEntity seller) {
        this.seller = seller;
    }
    public ProductEntity getProduct() {
        return product;
    }
    public void setProduct(ProductEntity product) {
        this.product = product;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public Double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    public String getCanceledBy() {
        return canceledBy;
    }
    public void setCanceledBy(String canceledBy) {
        this.canceledBy = canceledBy;
    }

    
}
