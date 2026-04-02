package com.example.todo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sub_tasks")
public class SubTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "todo_id", nullable = false)
    private Long todoId;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    public SubTask() {
    }

    public SubTask(String text, Long todoId, int sortOrder) {
        this.text = text;
        this.todoId = todoId;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public Long getTodoId() { return todoId; }
    public void setTodoId(Long todoId) { this.todoId = todoId; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
