package com.example.besideCoding.problem.repository;

import com.example.besideCoding.problem.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Integer> {

    // Using JPQL for more flexible IN clause handling with lists
    // This query will be the primary one for filtering
    @Query("SELECT p FROM Problem p WHERE " +
            "p.status = 'Live' AND " +  // ✅ New condition added
            "(:category IS NULL OR p.category = :category) AND " +
            "(:subCategories IS NULL OR p.subCategory IN :subCategories) AND " +
            "(:companies IS NULL OR p.company IN :companies) AND " +
            "(:searchTerm IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "ORDER BY p.id ASC")
    List<Problem> findProblemsByMultipleFilters(
            @Param("category") String category,
            @Param("subCategories") List<String> subCategories,
            @Param("companies") List<String> companies,
            @Param("searchTerm") String searchTerm);


    // Keep distinct queries
    @Query(value = "SELECT DISTINCT sub_category FROM problems WHERE sub_category IS NOT NULL AND sub_category <> '' ORDER BY sub_category ASC", nativeQuery = true)
    List<String> findAllDistinctSubCategories();

    @Query(value = "SELECT DISTINCT company FROM problems WHERE company IS NOT NULL AND company <> '' ORDER BY company ASC", nativeQuery = true)
    List<String> findAllDistinctCompanies();

    @Query("SELECT p.difficulty, COUNT(p) " +
            "FROM Problem p WHERE p.status = com.example.besideCoding.problem.model.Problem$Status.Live " +
            "GROUP BY p.difficulty")
    List<Object[]> countProblemsByDifficulty();


    // You can keep or remove these older native queries if they are no longer needed
    // or if the JPQL query above now covers all their use cases.
    // For simplicity, I'm assuming findProblemsByMultipleFilters will be the main one.

    /*
    @Query(value = "SELECT * FROM problems ORDER BY id ASC", nativeQuery = true)
    List<Problem> fetchAllProblems();

    @Query(value = "SELECT * FROM problems WHERE " +
            "(:category IS NULL OR category = :category) AND " +
            "(:subCategory IS NULL OR sub_category = :subCategory) AND " +
            "(:company IS NULL OR company = :company) " +
            "ORDER BY id ASC",
            nativeQuery = true)
    List<Problem> findProblemsByFilters(
            @Param("category") String category,
            @Param("subCategory") String subCategory,
            @Param("company") String company);

    @Query(value = "SELECT * FROM problems WHERE " +
            "(:category IS NULL OR category = :category) AND " +
            "(:subCategory IS NULL OR sub_category = :subCategory) AND " +
            "(:company IS NULL OR company = :company) AND " +
            "(:searchTerm IS NULL OR LOWER(title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "ORDER BY id ASC",
            nativeQuery = true)
    List<Problem> findProblemsByFiltersAndSearch(
            @Param("category") String category,
            @Param("subCategory") String subCategory,
            @Param("company") String company,
            @Param("searchTerm") String searchTerm);
    */

    // Using JpaRepository's findById is preferred over custom fetchProblemById
    // Problem fetchProblemById(@Param("id") int id);

    // String findAdditionalInfoByProblemId(@Param("id") int id);
}