package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.response.ImageResponse;
import com.vusal.azerbook.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/hotel/{hotelId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponse> upload(
            @PathVariable Long hotelId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "false") Boolean isMain
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageService.upload(hotelId, file, isMain));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<ImageResponse>> getByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(imageService.getByHotelId(hotelId));
    }

    @GetMapping("/hotel/{hotelId}/main")
    public ResponseEntity<ImageResponse> getMainImage(@PathVariable Long hotelId) {
        return ResponseEntity.ok(imageService.getMainImageByHotelId(hotelId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        imageService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
