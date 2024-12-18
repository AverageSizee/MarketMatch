package com.marketmatch.appdev.BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

//import java.awt.Image;


@Entity
@Table(name = "tbl_user")
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;

	//private Image image;
	private String Firstname;
	private String Lastname;
	private String Address;
	private String Phonenumber;
	private String studentid;
	private String email;
	private String Password;
	private boolean isSeller;

	@Column(name = "profilePicture",columnDefinition = "longblob")
    private byte[] image;

	@JsonManagedReference
	@OneToOne(mappedBy = "userid")
	private SellerEntity seller_id;


	@JsonManagedReference
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private BuyerEntity buyer;

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getFirstname() {
		return Firstname;
	}

	public void setFirstname(String firstname) {
		Firstname = firstname;
	}

	public String getLastname() {
		return Lastname;
	}

	public void setLastname(String lastname) {
		Lastname = lastname;
	}

	public String getAddress() {
		return Address;
	}

	public void setAddress(String address) {
		Address = address;
	}

	public String getPhonenumber() {
		return Phonenumber;
	}

	public void setPhonenumber(String phonenumber) {
		Phonenumber = phonenumber;
	}

	public String getstudentid() {
		return studentid;
	}

	public void setstudentid(String studentId) {
		studentid = studentId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return Password;
	}

	public void setPassword(String password) {
		Password = password;
	}

	public SellerEntity getSeller_id() {
		return seller_id;
	}

	public void setSeller_id(SellerEntity seller_id) {
		this.seller_id = seller_id;
	}

	public BuyerEntity getBuyer() {
		return buyer;
	}

	public void setBuyer(BuyerEntity buyer) {
		this.buyer = buyer;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public boolean isSeller() {
		return isSeller;
	}

	public void setSeller(boolean isSeller) {
		this.isSeller = isSeller;
	}
	
}
