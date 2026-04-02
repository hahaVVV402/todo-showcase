package com.example.todo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.NONE;

    @Column(length = 2000)
    private String note;

    @Column(name = "my_day", nullable = false)
    private boolean myDay = false;

    @Column(name = "list_id")
    private Long listId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Todo() {
        this.createdAt = LocalDateTime.now();
    }

    public Todo(String text) {
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public boolean isMyDay() { return myDay; }
    public void setMyDay(boolean myDay) { this.myDay = myDay; }
    public Long getListId() { return listId; }
    public void setListId(Long listId) { this.listId = listId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
