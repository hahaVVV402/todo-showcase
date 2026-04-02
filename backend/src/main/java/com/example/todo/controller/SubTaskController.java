package com.example.todo.controller;

import com.example.todo.model.SubTask;
import com.example.todo.repository.SubTaskRepository;
import com.example.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/todos/{todoId}/subtasks")
public class SubTaskController {

    private final SubTaskRepository subTaskRepository;
    private final TodoRepository todoRepository;

    @Autowired
    public SubTaskController(SubTaskRepository subTaskRepository, TodoRepository todoRepository) {
        this.subTaskRepository = subTaskRepository;
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public ResponseEntity<List<SubTask>> getSubTasks(@PathVariable("todoId") Long todoId) {
        if (!todoRepository.existsById(todoId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subTaskRepository.findByTodoIdOrderBySortOrder(todoId));
    }

    @PostMapping
    public ResponseEntity<?> addSubTask(@PathVariable("todoId") Long todoId, @RequestBody SubTask request) {
        if (!todoRepository.existsById(todoId)) {
            return ResponseEntity.notFound().build();
        }
        if (request.getText() == null || request.getText().trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Text cannot be empty");
            return ResponseEntity.badRequest().body(error);
        }
        
        SubTask newSubTask = new SubTask(request.getText().trim(), todoId, request.getSortOrder());
        newSubTask.setCompleted(request.isCompleted());
        SubTask savedSubTask = subTaskRepository.save(newSubTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSubTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubTask(@PathVariable("todoId") Long todoId, @PathVariable("id") Long id, @RequestBody SubTask request) {
        if (!todoRepository.existsById(todoId)) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<SubTask> existingOptional = subTaskRepository.findById(id);
        if (existingOptional.isEmpty() || !existingOptional.get().getTodoId().equals(todoId)) {
            return ResponseEntity.notFound().build();
        }

        SubTask existingSubTask = existingOptional.get();
        if (request.getText() != null && !request.getText().trim().isEmpty()) {
            existingSubTask.setText(request.getText().trim());
        }
        existingSubTask.setCompleted(request.isCompleted());
        existingSubTask.setSortOrder(request.getSortOrder()); // Allows reordering
        
        SubTask savedSubTask = subTaskRepository.save(existingSubTask);
        return ResponseEntity.ok(savedSubTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubTask(@PathVariable("todoId") Long todoId, @PathVariable("id") Long id) {
        Optional<SubTask> existingOptional = subTaskRepository.findById(id);
        if (existingOptional.isEmpty() || !existingOptional.get().getTodoId().equals(todoId)) {
            return ResponseEntity.notFound().build();
        }
        subTaskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
