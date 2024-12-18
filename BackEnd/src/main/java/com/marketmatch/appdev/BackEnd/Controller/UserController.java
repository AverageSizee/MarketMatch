package com.marketmatch.appdev.BackEnd.Controller;

import java.nio.file.attribute.UserPrincipal;
import java.util.Collections;
import java.util.List;

import com.marketmatch.appdev.BackEnd.Service.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marketmatch.appdev.BackEnd.DTO.SEmailRequest;
import com.marketmatch.appdev.BackEnd.DTO.StudentIdRequest;
import com.marketmatch.appdev.BackEnd.Entity.LoginRequest;
import com.marketmatch.appdev.BackEnd.Entity.UserEntity;
import com.marketmatch.appdev.BackEnd.Service.TokenService;
import com.marketmatch.appdev.BackEnd.Service.UserService;

import jakarta.servlet.http.HttpSession;






@RestController
@RequestMapping("/api/user")
public class UserController {

@Autowired
UserService userv;

@Autowired
BuyerService buyer_srv;

private final TokenService tokenService;


public UserController(TokenService tokenService) {
	this.tokenService = tokenService;
}


@PostMapping("/postUser")
public ResponseEntity<UserEntity> postCourse(@RequestBody UserEntity user) {
	UserEntity newUser = userv.addUserRecord(user);
	return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
}

@PostMapping("/check-student-id")
public ResponseEntity<?> checkStudentIdExists(@RequestBody StudentIdRequest studentIdRequest) {
	String studentId = studentIdRequest.getStudentId();
	System.out.println(studentId);
	boolean exists = userv.doesStudentIdExist(studentId);
	return ResponseEntity.ok().body("{\"exists\": " + exists + "}");
}

@PostMapping("check-email")
public ResponseEntity<?> checkEmailExists(@RequestBody SEmailRequest sEmailreqRequest) {
	String email = sEmailreqRequest.getEmail();
	boolean exists = userv.doesEmailExist(email);
	return ResponseEntity.ok().body("{\"exists\": " + exists + "}");
}


@GetMapping("/getUser")
public List<UserEntity> getUser(){
	return userv.readUsers();
}

@GetMapping("/getUserbyId")
public UserEntity getMethodName(@RequestParam int id) {
    return userv.getUserById(id);
}


@PutMapping("/updateUser")
public UserEntity updateUser( @RequestParam  int id, @RequestBody UserEntity user) {
	return userv.putUserDetails(id,user);
}

@PutMapping("/updatePassword")
public ResponseEntity<String> updatePassword(@RequestParam int id, @RequestParam String password) {
    userv.updatePassword(id, password);
    return ResponseEntity.ok("Password updated successfully!");
}

@PutMapping("/{userId}/make-seller")
public ResponseEntity<UserEntity> makeSeller(@PathVariable int userId) {
	try {
		UserEntity updatedUser = userv.makeSeller(userId);
		return ResponseEntity.ok(updatedUser);
	} catch (RuntimeException e) {
		return ResponseEntity.status(404).body(null);
	}
}

@DeleteMapping("/deleteUser")
public String deleteUser(@PathVariable int id) {
	return userv.deleteUser(id);
}

@PostMapping("/login")
public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest,HttpSession session) {
    try{
		boolean isAuth = userv.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
		if (isAuth) {
			UserEntity user = userv.getUserByEmail(loginRequest.getEmail());
			Authentication authentication = new UsernamePasswordAuthenticationToken(user,null,Collections.emptyList());
			String jwtToken = tokenService.generateToken(authentication);
			session.setAttribute("id", user.getUserId());
			session.setAttribute("email", loginRequest.getEmail());
			return ResponseEntity.ok(jwtToken);
		}
		else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed at authentication");
		}
	}catch(Exception e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login Failed at start");
	}
}

@PostMapping("/setIDsession")
public ResponseEntity<String> setIDsession(@RequestBody LoginRequest loginRequest,HttpSession session) {
	try {
		boolean isAuth = userv.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
		if(isAuth) {
			UserEntity user = userv.getUserByEmail(loginRequest.getEmail());
			return ResponseEntity.ok(String.valueOf(user.getUserId()));
		}else{
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login Failed at authentication");
		}
	} catch (Exception e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to set ID in session");
	}
}


@PostMapping("/logout")
public ResponseEntity<String> logout(HttpSession session) {
	session.invalidate();
	return ResponseEntity.ok("Logout successful");
}


	
}
