package com.example.todo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "todo_lists")
public class TodoList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Transient
    private long todoCount; // used for returning count dynamically

    public TodoList() {
        this.createdAt = LocalDateTime.now();
    }

    public TodoList(String name) {
        this.name = name;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public long getTodoCount() { return todoCount; }
    public void setTodoCount(long todoCount) { this.todoCount = todoCount; }
}
