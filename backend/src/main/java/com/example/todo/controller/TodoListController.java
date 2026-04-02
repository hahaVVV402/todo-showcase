package com.example.todo.controller;

import com.example.todo.model.TodoList;
import com.example.todo.repository.TodoListRepository;
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
@RequestMapping("/api/lists")
public class TodoListController {

    private final TodoListRepository listRepository;
    private final TodoRepository todoRepository;

    @Autowired
    public TodoListController(TodoListRepository listRepository, TodoRepository todoRepository) {
        this.listRepository = listRepository;
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public ResponseEntity<List<TodoList>> getAllLists() {
        List<TodoList> lists = listRepository.findAll();
        for (TodoList list : lists) {
            list.setTodoCount(todoRepository.countByListId(list.getId()));
        }
        return ResponseEntity.ok(lists);
    }

    @PostMapping
    public ResponseEntity<?> createList(@RequestBody TodoList request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Name cannot be empty");
            return ResponseEntity.badRequest().body(error);
        }
        TodoList newList = new TodoList(request.getName().trim());
        TodoList savedList = listRepository.save(newList);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateList(@PathVariable("id") Long id, @RequestBody TodoList request) {
        Optional<TodoList> existingOptional = listRepository.findById(id);
        if (existingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TodoList existingList = existingOptional.get();
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingList.setName(request.getName().trim());
        }
        TodoList savedList = listRepository.save(existingList);
        return ResponseEntity.ok(savedList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable("id") Long id) {
        if (!listRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Orphan todos before deleting list
        todoRepository.findByListIdOrderByCreatedAtDesc(id).forEach(todo -> {
            todo.setListId(null);
            todoRepository.save(todo);
        });
        
        listRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
