package com.marketmatch.appdev.BackEnd.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;

    private String productName;
    @Column(name = "product_description", columnDefinition = "LongText")
    private String productDescription;
    private String productPrice;
    private String productStock;
    private String productStatus;
    private String productTimeCreated;

    @Column(name = "image",columnDefinition = "longblob")
    private byte[] image;
    
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
        @JoinTable(name = "Cart_Products",
            joinColumns = { @JoinColumn(name = "productId")},
            inverseJoinColumns = { @JoinColumn (name = "cartID")})
    private List<CartEntity> cart;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private  SellerEntity sellerid;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<BuyEntity> bought;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SHistoryEntity> Shistory;
    
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BHistoryEntity> Bhistory;

    public ProductEntity() {
        super();
    }

    public ProductEntity(int productId, String productName, String productDescription, String productPrice,
            String productStock, String productStatus, String productTimeCreated, byte[] image, SellerEntity sellerid) {
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productStock = productStock;
        this.productStatus = productStatus;
        this.productTimeCreated = productTimeCreated;
        this.image = image;
        this.sellerid = sellerid;
    }
    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getProductDescription() {
        return productDescription;
    }
    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }
    public String getProductPrice() {
        return productPrice;
    }
    public void setProductPrice(String productPrice) {
        this.productPrice = productPrice;
    }
    public String getProductStock() {
        return productStock;
    }
    public void setProductStock(String productStock) {
        this.productStock = productStock;
    }
    public String getProductStatus() {
        return productStatus;
    }
    public void setProductStatus(String productStatus) {
        this.productStatus = productStatus;
    }
    public String getProductTimeCreated() {
        return productTimeCreated;
    }
    public void setProductTimeCreated(String productTimeCreated) {
        this.productTimeCreated = productTimeCreated;
    }
    public byte[] getImage() {
        return image;
    }
      
    public void setImage(byte[] image) {
        this.image = image;
    }


    public void setSellerid(SellerEntity sellerid) {
        this.sellerid = sellerid;
    }
    
    // public SellerEntity getSellerid() {
    //     return sellerid;
    // }
    // public List<BuyEntity> getBought() {
    //     return bought;
    // }

    public void setBought(List<BuyEntity> bought) {
        this.bought = bought;
    }

    // public List<CartEntity> getCart() {
    //     return cart;
    // }

    public void setCart(List<CartEntity> cart) {
        this.cart = cart;
    }

    public void addCart(CartEntity cart) {
        if (this.cart == null) {
            this.cart = new ArrayList<>();
        }
        this.cart.add(cart);
    }
    
    
    

}
