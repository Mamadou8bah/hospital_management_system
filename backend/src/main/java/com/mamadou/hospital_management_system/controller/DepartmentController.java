import com.mamadou.hospital_management_system.dto.AddDepartmentRequest;
import com.mamadou.hospital_management_system.dto.DepartmentDetailResponse;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> addDepartment(@RequestBody AddDepartmentRequest request) {
        try{
            return ResponseEntity.ok(departmentService.addDepartment(request));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDetailResponse> getDepartment(@PathVariable short id) {
        try{
            return ResponseEntity.ok(departmentService.getDepartmentDetailById(id));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDetailResponse>> getAllDepartments() {
        try{
            return ResponseEntity.ok().body(departmentService.findAllDepartments());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateDepartment(@RequestBody AddDepartmentRequest request, @PathVariable short id) {
        try{
            return ResponseEntity.ok(departmentService.updateDepartment(request, id));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteDepartment(@PathVariable short id) {
        try {
            return ResponseEntity.ok(departmentService.deleteDepartment(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
