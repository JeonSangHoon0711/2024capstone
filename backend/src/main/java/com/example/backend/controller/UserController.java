package com.example.backend.controller;

import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users") // API의 기본 경로 설정
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 비밀번호 암호화를 위한 BCryptPasswordEncoder 인스턴스 생성
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/all") // GET 요청을 "/api/users/all" 경로로 받습니다.
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll(); // 모든 사용자 정보를 반환합니다.
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserEntity user) {
        // 중복 확인
        if (userRepository.existsByName(user.getName())) {
            return new ResponseEntity<>("Name is already taken", HttpStatus.CONFLICT);
        }
        if (userRepository.existsById(user.getId())) {
            return new ResponseEntity<>("ID is already taken", HttpStatus.CONFLICT);
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(user.getPw());
        user.setPw(encodedPassword);

        // 사용자 정보 저장
        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody UserEntity user) {
        // 사용자 인증
        UserEntity foundUser = userRepository.findById(user.getId()).orElse(null);
        if (foundUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(user.getPw(), foundUser.getPw())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // 반환할 값을 Map에 넣습니다.
        Map<String, Object> response = new HashMap<>();
        response.put("uid", foundUser.getUid());
        response.put("name", foundUser.getName());
        response.put("id", foundUser.getId());

        // Map을 ResponseEntity로 반환합니다.
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
