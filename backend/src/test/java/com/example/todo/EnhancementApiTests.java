package com.example.todo;

import com.example.todo.model.Priority;
import com.example.todo.model.SubTask;
import com.example.todo.model.Todo;
import com.example.todo.model.TodoList;
import com.example.todo.repository.SubTaskRepository;
import com.example.todo.repository.TodoListRepository;
import com.example.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@Transactional
public class EnhancementApiTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TodoListRepository listRepository;

    @Autowired
    private SubTaskRepository subTaskRepository;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        subTaskRepository.deleteAll();
        todoRepository.deleteAll();
        listRepository.deleteAll();
    }

    @Test
    public void testTodoListCrudOps() throws Exception {
        // 1. Create List
        String listJsonPayload = "{\"name\":\"Work Tasks\"}";
        String listJson = mockMvc.perform(post("/api/lists")
                .contentType(MediaType.APPLICATION_JSON)
                .content(listJsonPayload))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Work Tasks"))
                .andReturn().getResponse().getContentAsString();

        Long listId = Long.parseLong(listJson.split("\"id\":")[1].split(",")[0].replaceAll("[^0-9]", ""));

        // 2. Add Todo to List
        String todoJsonPayload = "{\"text\":\"Finish Proposal\", \"listId\":" + listId + "}";
        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todoJsonPayload))
                .andDo(print())
                .andExpect(status().isCreated());

        // 3. Get Lists (Verify list has 1 todoCount)
        mockMvc.perform(get("/api/lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].todoCount").value(1));

        // 4. Update List
        String updateListPayload = "{\"name\":\"Project Beta\"}";
        mockMvc.perform(put("/api/lists/" + listId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateListPayload))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Project Beta"));

        // 5. Delete List (should orphan tasks)
        mockMvc.perform(delete("/api/lists/" + listId))
                .andExpect(status().isNoContent());

        // Verify task is orphaned (listId = null)
        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].listId").isEmpty());
    }

    @Test
    public void testTodoExtendedFieldsAndViews() throws Exception {
        String todo1Payload = "{\"text\":\"Meeting\", \"priority\":\"HIGH\", \"myDay\":true, \"note\":\"Discuss Q3 budget\"}";
        String todo2Payload = "{\"text\":\"Pick up groceries\", \"priority\":\"LOW\", \"myDay\":false}";

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todo1Payload));

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todo2Payload));

        // Test GET My Day
        mockMvc.perform(get("/api/todos/my-day"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].text").value("Meeting"));

        // Test GET Search (Search 'Q3 budget' inside notes)
        mockMvc.perform(get("/api/todos/search?q=Q3 budget"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].text").value("Meeting"));
    }

    @Test
    public void testSubTaskCrudOps() throws Exception {
        // Create parent Todo
        String todoPayload = "{\"text\":\"Launch Product\"}";
        String todoJson = mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(todoPayload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long todoId = Long.parseLong(todoJson.split("\"id\":")[1].split(",")[0].replaceAll("[^0-9]", ""));

        // Add 2 SubTasks
        String sub1Payload = "{\"text\":\"Design DB schema\", \"sortOrder\":0}";
        String sub2Payload = "{\"text\":\"Write API docs\", \"sortOrder\":1}";

        String subJson = mockMvc.perform(post("/api/todos/" + todoId + "/subtasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(sub1Payload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
                
        Long subId = Long.parseLong(subJson.split("\"id\":")[1].split(",")[0].replaceAll("[^0-9]", ""));

        mockMvc.perform(post("/api/todos/" + todoId + "/subtasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(sub2Payload))
                .andExpect(status().isCreated());

        // Get SubTasks
        mockMvc.perform(get("/api/todos/" + todoId + "/subtasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        // Update SubTask (mark complete)
        String sub1UpdatePayload = "{\"text\":\"Design DB schema\", \"completed\":true}";
        mockMvc.perform(put("/api/todos/" + todoId + "/subtasks/" + subId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(sub1UpdatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        // Delete SubTask
        mockMvc.perform(delete("/api/todos/" + todoId + "/subtasks/" + subId))
                .andExpect(status().isNoContent());

        // Verify deletion
        mockMvc.perform(get("/api/todos/" + todoId + "/subtasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        // Delete Todo and verify SubTasks are also deleted
        mockMvc.perform(delete("/api/todos/" + todoId))
                .andExpect(status().isNoContent());
                
        mockMvc.perform(get("/api/todos/" + todoId + "/subtasks"))
                .andExpect(status().isNotFound()); // SubTaskController throws 404 if Todo doesn't exist
    }
}
