package com.marketmatch.appdev.BackEnd.DTO;

import jakarta.persistence.Column;

public class Items {
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

    private int sellerid;


    public Items(int productId, String productName, String productDescription, String productPrice, String productStock,
            String productStatus, String productTimeCreated, byte[] image, int sellerid) {
        super();
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

    public int getSellerid() {
        return sellerid;
    }

    public void setSellerid(int sellerid) {
        this.sellerid = sellerid;
    }

    
    
}
