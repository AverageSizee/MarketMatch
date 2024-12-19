package com.marketmatch.appdev.BackEnd.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Repository;

import com.marketmatch.appdev.BackEnd.DTO.Items;
import com.marketmatch.appdev.BackEnd.Entity.ProductEntity;
import com.marketmatch.appdev.BackEnd.Entity.SellerEntity;

@Repository
public interface ProductRepo extends JpaRepository<ProductEntity, Integer> {

    ProductEntity findByproductId(int productId);

    List<ProductEntity> findBysellerid(SellerEntity sellerid);

    @Query("SELECT p FROM ProductEntity p WHERE p.productName LIKE %"+":productName"+"% AND p.productId != :productId")
    List<ProductEntity> findRelatedProducts(@Param("productName") String productName, @Param("productId") int productId);

    @Query(value = "SELECT * FROM product_entity ORDER BY RAND() LIMIT 2", nativeQuery = true)
    List<ProductEntity> findRandomProducts();

    @Query("SELECT new com.marketmatch.appdev.BackEnd.DTO.Items( " +
        "prod.productId, prod.productName, prod.productDescription, prod.productPrice, " +
        "prod.productStock, prod.productStatus, prod.productTimeCreated, prod.image, seller.seller_id) " +
        "FROM ProductEntity prod " +
        "JOIN prod.sellerid seller")
    List<Items> findAllProducts();

    @Query("SELECT new com.marketmatch.appdev.BackEnd.DTO.Items( " +
        "prod.productId, prod.productName, prod.productDescription, prod.productPrice, " +
        "prod.productStock, prod.productStatus, prod.productTimeCreated, prod.image, seller.seller_id) " +
        "FROM ProductEntity prod " +
        "JOIN prod.sellerid seller " +
        "WHERE prod.productId = :productId")
    Items findProductById(int productId);
}
