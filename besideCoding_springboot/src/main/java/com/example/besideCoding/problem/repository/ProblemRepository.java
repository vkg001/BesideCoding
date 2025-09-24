package com.example.besideCoding.problem.repository;

import com.example.besideCoding.problem.model.Problems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problems, Integer> {

    @Query("SELECT p FROM problems p WHERE " +
            "p.status = com.example.besideCoding.problem.model.Problem$Status.Live AND " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:subCategories IS NULL OR p.subCategory IN :subCategories) AND " +
            "(:companies IS NULL OR p.company IN :companies) AND " +
            "(:searchTerm IS NULL OR LOWER(CAST(p.title AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "ORDER BY p.id ASC")
    List<Problems> findProblemsByMultipleFilters(
            @Param("category") String category,
            @Param("subCategories") List<String> subCategories,
            @Param("companies") List<String> companies,
            @Param("searchTerm") String searchTerm);

    @Query(value = "SELECT DISTINCT sub_category FROM problems WHERE sub_category IS NOT NULL AND sub_category <> '' ORDER BY sub_category ASC", nativeQuery = true)
    List<String> findAllDistinctSubCategories();

    @Query(value = "SELECT DISTINCT company FROM problems WHERE company IS NOT NULL AND company <> '' ORDER BY company ASC", nativeQuery = true)
    List<String> findAllDistinctCompanies();

    @Query("SELECT p.difficulty, COUNT(p) FROM problems p WHERE p.status = com.example.besideCoding.problem.model.Problem$Status.Live GROUP BY p.difficulty")
    List<Object[]> countProblemsByDifficulty();
}