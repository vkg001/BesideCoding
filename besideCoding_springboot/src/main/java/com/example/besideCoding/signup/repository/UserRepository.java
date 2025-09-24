package com.example.besideCoding.signup.repository;

import com.example.besideCoding.signup.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {

    int countByEmail(String email);

    Users findByEmailAndPassword(String email, String password);

    @Override
    Optional<Users> findById(Integer id);

    Optional<Users> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET profile_pic = :imageUrl WHERE id = :userId", nativeQuery = true)
    void updateProfilePic(@Param("userId") Integer userId, @Param("imageUrl") String imageUrl);
}

