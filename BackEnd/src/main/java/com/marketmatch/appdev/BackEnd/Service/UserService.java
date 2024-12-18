package com.marketmatch.appdev.BackEnd.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.NameNotFoundException;

import com.marketmatch.appdev.BackEnd.DTO.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.marketmatch.appdev.BackEnd.Entity.UserEntity;
import com.marketmatch.appdev.BackEnd.Repository.UserRepo;


@Service
public class UserService {

	@Autowired
	UserRepo urepo;

	@Autowired
	BuyerService buyer_serv;

	@Autowired
	private final BCryptPasswordEncoder bCryptPasswordEncoder;


	

	public UserService(UserRepo urepo, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.urepo = urepo;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	//CRUD METHODS
	//add user
	//DTO filter outs the data that is only need in frontend,
	//crucial data like primary key and password will not be included
	public UserEntity addUserRecord(UserEntity user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		return urepo.save(user);
	}

//	//add
//	public UserEntity addUserRecord(UserEntity user) {
//		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
//		return urepo.save(user);
//	}

	//read
	public List<UserEntity> readUsers(){
		return urepo.findAll();
	}
	public UserEntity getUserById(int id) {
		return urepo.findByuserId(id);
	}

    // Check if the student ID already exists in the database
    public boolean doesStudentIdExist(String studentId) {
        return urepo.existsByStudentid(studentId);
    }

	public boolean doesEmailExist(String email) {
		return urepo.existsByEmail(email);
	}

	//update
	@SuppressWarnings("finally")
	public UserEntity putUserDetails(int id, UserEntity newUserDetails) {
		UserEntity user = new UserEntity();
		
		
		try {
			//student baryabol
			user = urepo.findByuserId(id);
			
			
			//settingnimplementation
	//		user.setImage(newUserDetails.getImage());
			user.setFirstname(newUserDetails.getFirstname());
			user.setLastname(newUserDetails.getLastname());
			user.setAddress(newUserDetails.getAddress());
			user.setPhonenumber(newUserDetails.getPhonenumber());
			user.setstudentid(newUserDetails.getstudentid());
			user.setEmail(newUserDetails.getEmail());
			user.setPassword(newUserDetails.getPassword());
			user.setImage(newUserDetails.getImage());


			
		}catch(NoSuchElementException nex) {
			throw new NameNotFoundException("User " + id + " not found");
		}finally {
			return urepo.save(user);
		}

	}

	public UserEntity makeSeller(int userId) {

        UserEntity user = urepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
				
        user.setSeller(true);

        return urepo.save(user);
    }

	public void updatePassword(int id, String password) {
		UserEntity user = urepo.findById(id).orElseThrow();
		user.setPassword(bCryptPasswordEncoder.encode(password));
		urepo.save(user);
	}

	//delete	
	@SuppressWarnings({ "unused" })
		public String deleteUser(int id) {
			String msg="";
			
			if(urepo.findById(id)!=null) {
				urepo.deleteById(id);
				msg = "User Record successfully deleted";
			}else {
				msg = id + "NOT found";
			}
			
			return msg;
		}

	//Authenticate
	public boolean authenticate(String email, String password) {
		UserEntity user = urepo.findByEmail(email);
			if (user == null) {
				throw new BadCredentialsException("email not found");
			}
			System.out.println("User found: " + user.getEmail());
			if(!user.getEmail().equals(email)){
				throw new BadCredentialsException("email not found");
			}
			if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
				throw new BadCredentialsException("password is incorrect");
			}
		return true;
	}

	public UserEntity getUserByEmail(String email) {
        return urepo.findByEmail(email);
    }
	
}
