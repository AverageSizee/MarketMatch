package com.marketmatch.appdev.BackEnd.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.marketmatch.appdev.BackEnd.Entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {
	public UserEntity findByEmail(String email);
	public UserEntity findByuserId(int id);
	public boolean existsByEmail(String email);
	@Query("SELECT COUNT(u) > 0 FROM UserEntity u WHERE u.studentid = :studentid")
	boolean existsByStudentid(@Param("studentid") String studentid);
}
