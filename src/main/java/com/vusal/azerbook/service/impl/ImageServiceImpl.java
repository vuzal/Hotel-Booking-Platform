package com.vusal.azerbook.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vusal.azerbook.model.response.ImageResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Image;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.ImageRepository;
import com.vusal.azerbook.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final HotelRepository hotelRepository;
    private final Cloudinary cloudinary;
    private final EntityMapper mapper;


    private String uploadToCloudinary(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "azerbook/hotels",
                            "resource_type", "auto"
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    private String extractPublicId(String imageUrl) {
        // Extract public ID from Cloudinary URL
        // Example: https://res.cloudinary.com/xxx/image/upload/v123/azerbook/hotels/abc.jpg
        // Result: azerbook/hotels/abc
        String[] parts = imageUrl.split("/upload/");
        if (parts.length > 1) {
            String path = parts[1];
            // Remove version number if exists (v123/)
            if (path.startsWith("v")) {
                path = path.substring(path.indexOf("/") + 1);
            }
            // Remove extension
            return path.substring(0, path.lastIndexOf("."));
        }
        return null;
    }

    private void deleteFromCloudinary(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
        }catch (IOException e){
            throw new RuntimeException("Failed to delete image from Cloudinary",e);
        }
    }


    @Override
    public ImageResponse upload(Long hotelId, MultipartFile file, Boolean isMain) {
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new RuntimeException("HotelNotFound"));

        if (Boolean.TRUE.equals(isMain)) {
            imageRepository.findByHotelIdAndIsMainTrue(hotelId)
                    .ifPresent(image -> {
                        image.setIsMain(false);
                        imageRepository.save(image);
                    });
        }

        String imageUrl = uploadToCloudinary(file);

        Image image = Image.builder()
                .hotel(hotel)
                .url(imageUrl)
                .isMain(isMain != null ? isMain : false)
                .build();
        Image saved = imageRepository.save(image);
        return mapper.toImageResponse(saved);

    }

    @Override
    public List<ImageResponse> getByHotelId(Long hotelId) {
        return imageRepository.findByHotelId(hotelId).stream()
                .map(mapper::toImageResponse)
                .toList();
    }

    @Override
    public ImageResponse getMainImageByHotelId(Long hotelId) {
        Image image = imageRepository.findByHotelIdAndIsMainTrue(hotelId).orElseThrow(() -> new RuntimeException("Main image not found"));
        return mapper.toImageResponse(image);
    }

    @Override
    public void delete(Long id) {
        Image image=imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));

        deleteFromCloudinary(image.getUrl());
        image.setIsActive(false);
        imageRepository.save(image);
    }
}
