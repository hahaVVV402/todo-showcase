package com.example.todo.repository;

import com.example.todo.model.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByTodoIdOrderBySortOrder(Long todoId);
    void deleteByTodoId(Long todoId);
}
