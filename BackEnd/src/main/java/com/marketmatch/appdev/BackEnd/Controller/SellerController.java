package com.marketmatch.appdev.BackEnd.Controller;


import com.marketmatch.appdev.BackEnd.DTO.Transaction;
import com.marketmatch.appdev.BackEnd.Entity.CartEntity;
import com.marketmatch.appdev.BackEnd.Entity.ProductEntity;
import com.marketmatch.appdev.BackEnd.Entity.SellerEntity;
import com.marketmatch.appdev.BackEnd.Entity.UserEntity;

import com.marketmatch.appdev.BackEnd.Service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/seller")
public class SellerController {

    @Autowired
    SellerService seller_serv;

    @GetMapping("/getAll/{sellerid}")
    public SellerEntity getAllSeller(@PathVariable int sellerid) {
        SellerEntity seller = seller_serv.getSellerById(sellerid);
        // seller.getProducts().size();
        return seller;
    }

    @GetMapping("/{id}")
    public SellerEntity getSellerById(@PathVariable int id) {
        return seller_serv.getSellerById(id);
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions(@RequestParam int id){
        System.out.println(id);
        return seller_serv.getTransactions(id) ;
    }

    @PutMapping("/edit")
    public SellerEntity editSeller(@RequestParam int id, @RequestBody SellerEntity seller) {
        return seller_serv.editSeller(id, seller);
    }

    @PostMapping("/postSeller/{sellerid}")
    public SellerEntity createSeller(@RequestBody SellerEntity details, @PathVariable int sellerid) {
        return seller_serv.createNewSeller(details,sellerid);
    }

    @PostMapping("/addProduct/{sellerid}")
    public SellerEntity addProductToSeller(@PathVariable int sellerid, @RequestBody ProductEntity product) {
        return seller_serv.addProductToSeller(sellerid, product);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteSeller(@PathVariable int id) {
        return seller_serv.deleteSeller(id);
    }

}
