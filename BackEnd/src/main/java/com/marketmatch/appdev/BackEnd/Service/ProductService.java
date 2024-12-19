package com.marketmatch.appdev.BackEnd.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.naming.NameNotFoundException;

import com.marketmatch.appdev.BackEnd.DTO.Account;
import com.marketmatch.appdev.BackEnd.DTO.Items;
import com.marketmatch.appdev.BackEnd.DTO.ProductRequest;
import com.marketmatch.appdev.BackEnd.Entity.SellerEntity;
import com.marketmatch.appdev.BackEnd.Entity.UserEntity;
import com.marketmatch.appdev.BackEnd.Repository.SellerRepo;
import com.marketmatch.appdev.BackEnd.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marketmatch.appdev.BackEnd.Repository.ProductRepo;
import com.marketmatch.appdev.BackEnd.Entity.ProductEntity;

@Service
public class ProductService {

    @Autowired
    ProductRepo prodrepo;

    @Autowired
    UserRepo user_repo;

    @Autowired
    SellerService seller_serv;

    public ProductService() {
        super();
    }
    
    //CREATE
    public ProductEntity createProduct(ProductEntity product) {
        System.out.println(product);
        return prodrepo.save(product);
    }

    // public ProductEntity createProducts(ProductRequest product){
    //     // UserEntity user = user_repo.findByEmail(product.getEmail());

    //     // if(user.getSeller_id() != null){
    //     //     product.getProduct().setSellerid(user.getSeller_id());
    //     // }else{
    //     //     SellerEntity seller = seller_serv.createNewSeller(user);
    //     //     product.getProduct().setSellerid(seller);
    //     // }
    //     return prodrepo.save(product.getProduct());
    // }

    //READ
    public ProductEntity readProducts(int productId) {
        try {
            Optional<ProductEntity> productOptional = prodrepo.findById(productId);
            if (productOptional.isPresent()) {
                return productOptional.get(); 
            } else {
                throw new RuntimeException("Product not found with ID: " + productId); 
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving product: " + e.getMessage(), e); 
        }
    }

    public Items getProductById(int productId) {
        return prodrepo.findProductById(productId);
    }
    
    public List<ProductEntity> readAllProducts() {
       return prodrepo.findAll();
    }
    
    public List<ProductEntity> getProductsSoldByUser(SellerEntity id) {
        return prodrepo.findBysellerid(id);
    }

        public List<Items> getAllProducts() {
        return prodrepo.findAllProducts();
    }

    public List<ProductEntity> getRelatedProducts(String productName, int productId) {
        List<ProductEntity> relatedProducts = prodrepo.findRelatedProducts(productName, productId);

        // If no related products are found, fetch random products
        if (relatedProducts == null || relatedProducts.isEmpty()) {
            relatedProducts = prodrepo.findRandomProducts(); // Limit to 5 random products
        }

        return relatedProducts;
    }

    public ProductEntity updateProduct(int productId, ProductEntity updatedProduct) {
        ProductEntity product = prodrepo.findByproductId(productId);
    
        // Update only the specified fields
        product.setProductName(updatedProduct.getProductName());
        product.setProductDescription(updatedProduct.getProductDescription());
        product.setProductPrice(updatedProduct.getProductPrice());
        product.setProductStock(updatedProduct.getProductStock());
        product.setProductStatus(updatedProduct.getProductStatus());
        product.setProductTimeCreated(updatedProduct.getProductTimeCreated());
        product.setImage(updatedProduct.getImage());
    
        // Save the updated product
        return prodrepo.save(product);
    }

    //DELETE
    @SuppressWarnings("unused")
    public String deleteProduct(int productId) {
        String msg = "";
        if (prodrepo.findById(productId) != null) {
            prodrepo.deleteById(productId);
            msg = "Product Record successfully deleted";
        } else {
            msg = productId + "NOT found";
        }
        return msg;
    }
}
