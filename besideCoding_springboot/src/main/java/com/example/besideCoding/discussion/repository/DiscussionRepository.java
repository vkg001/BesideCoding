package com.example.besideCoding.discussion.repository;

import com.example.besideCoding.discussion.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Integer> {

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
    """, nativeQuery = true)
    List<DiscussionProjection> fetchAllWithUser();

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
        WHERE d.type = ?1
    """, nativeQuery = true)
    List<DiscussionProjection> fetchByType(String type);

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
        ORDER BY d.created_at DESC
    """, nativeQuery = true)
    List<DiscussionProjection> fetchByNewest();

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
        ORDER BY d.likes DESC
    """, nativeQuery = true)
    List<DiscussionProjection> fetchByMostLiked();

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
        WHERE d.type = ?1
        ORDER BY d.created_at DESC
    """, nativeQuery = true)
    List<DiscussionProjection> fetchByTypeOrderByNewest(String type);

    @Query(value = """
        SELECT d.id AS discussion_id, d.user_id, d.title, d.description, d.likes, d.dislikes, d.views,
               d.type, d.created_at, u.name AS username
        FROM discussion d
        JOIN user u ON d.user_id = u.id
        WHERE d.type = ?1
        ORDER BY d.likes DESC
    """, nativeQuery = true)
    List<DiscussionProjection> fetchByTypeOrderByLikes(String type);

}