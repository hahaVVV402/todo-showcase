package com.example.todo.controller;

import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.SubTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository todoRepository;
    private final SubTaskRepository subTaskRepository;

    @Autowired
    public TodoController(TodoRepository todoRepository, SubTaskRepository subTaskRepository) {
        this.todoRepository = todoRepository;
        this.subTaskRepository = subTaskRepository;
    }

    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(@RequestParam(name = "listId", required = false) Long listId) {
        if (listId != null) {
            return ResponseEntity.ok(todoRepository.findByListIdOrderByCreatedAtDesc(listId));
        }
        return ResponseEntity.ok(todoRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/my-day")
    public ResponseEntity<List<Todo>> getMyDayTodos() {
        return ResponseEntity.ok(todoRepository.findByMyDayTrueOrDueDateOrderByCreatedAtDesc(java.time.LocalDate.now()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Todo>> searchTodos(@RequestParam("q") String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(todoRepository.searchByTextOrNote(q.trim()));
    }

    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody Todo todoRequest) {
        if (todoRequest.getText() == null || todoRequest.getText().trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Text cannot be empty");
            return ResponseEntity.badRequest().body(error);
        }
        Todo newTodo = new Todo(todoRequest.getText().trim());
        newTodo.setCompleted(todoRequest.isCompleted());
        newTodo.setDueDate(todoRequest.getDueDate());
        if (todoRequest.getPriority() != null) {
            newTodo.setPriority(todoRequest.getPriority());
        }
        newTodo.setNote(todoRequest.getNote());
        newTodo.setMyDay(todoRequest.isMyDay());
        newTodo.setListId(todoRequest.getListId());

        Todo savedTodo = todoRepository.save(newTodo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable("id") Long id, @RequestBody Map<String, Object> updates) {
        Optional<Todo> existingTodoOptional = todoRepository.findById(id);
        if (existingTodoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Todo existingTodo = existingTodoOptional.get();

        if (updates.containsKey("text")) {
            String text = (String) updates.get("text");
            if (text != null && !text.trim().isEmpty()) {
                existingTodo.setText(text.trim());
            }
        }
        if (updates.containsKey("completed")) {
            existingTodo.setCompleted(Boolean.TRUE.equals(updates.get("completed")));
        }
        if (updates.containsKey("dueDate")) {
            Object val = updates.get("dueDate");
            existingTodo.setDueDate(val != null ? java.time.LocalDate.parse(val.toString()) : null);
        }
        if (updates.containsKey("priority")) {
            Object val = updates.get("priority");
            existingTodo.setPriority(val != null ? Priority.valueOf(val.toString()) : Priority.NONE);
        }
        if (updates.containsKey("note")) {
            existingTodo.setNote((String) updates.get("note"));
        }
        if (updates.containsKey("myDay")) {
            existingTodo.setMyDay(Boolean.TRUE.equals(updates.get("myDay")));
        }
        if (updates.containsKey("listId")) {
            Object val = updates.get("listId");
            existingTodo.setListId(val != null ? Long.valueOf(val.toString()) : null);
        }
        
        Todo savedTodo = todoRepository.save(existingTodo);
        return ResponseEntity.ok(savedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable("id") Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        subTaskRepository.findByTodoIdOrderBySortOrder(id).forEach(subTaskRepository::delete);
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
