package com.example.todo.repository;

import com.example.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findAllByOrderByCreatedAtDesc();
    
    List<Todo> findByListIdOrderByCreatedAtDesc(Long listId);
    
    @Query("SELECT t FROM Todo t WHERE t.myDay = true OR t.dueDate = :today ORDER BY t.createdAt DESC")
    List<Todo> findByMyDayTrueOrDueDateOrderByCreatedAtDesc(@Param("today") LocalDate today);
    
    @Query("SELECT t FROM Todo t WHERE LOWER(t.text) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.note) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.createdAt DESC")
    List<Todo> searchByTextOrNote(@Param("keyword") String keyword);

    long countByListId(Long listId);
}
