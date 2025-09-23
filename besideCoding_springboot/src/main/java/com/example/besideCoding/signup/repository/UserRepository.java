package com.example.besideCoding.signup.repository;

import com.example.besideCoding.signup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT COUNT(u) FROM User u WHERE u.email = :email")
    int countByEmail(String email);

    @Query(value = "SELECT * FROM user WHERE email = :email AND password = :password", nativeQuery = true)
    User findByEmailAndPassword(@Param("email") String email, @Param("password") String password);

    Optional<User> findById(Integer id);
    //@Query(value = "SELECT * FROM user WHERE id = :id", nativeQuery = true)
    //User findUserById(@Param("id") Long id);

    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE user SET profile_pic = :imageUrl WHERE id = :userId", nativeQuery = true)
    void updateProfilePic(@Param("userId") Integer userId, @Param("imageUrl") String imageUrl);


}
