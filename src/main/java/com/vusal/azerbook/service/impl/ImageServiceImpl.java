package com.vusal.azerbook.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vusal.azerbook.exception.CloudinaryException;
import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.response.ImageResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Image;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.ImageRepository;
import com.vusal.azerbook.service.ImageService;
import jakarta.transaction.Transactional;
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


    @Override
    @Transactional
    public ImageResponse upload(Long hotelId, MultipartFile file, Boolean isMain) {
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. hotelID: " + hotelId));

        if (Boolean.TRUE.equals(isMain)) {
            imageRepository.findByHotelIdAndIsMainTrue(hotelId)
                    .ifPresent(image -> {
                        image.setIsMain(false);
                        imageRepository.save(image);
                    });
        }

        Map<?, ?> uploadResult;
        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "azerbook/hotels"));
        } catch (IOException e) {
            throw new CloudinaryException("AN ERROR OCCURRED WHILE UPLOADING THE IMAGE TO CLOUDINARY.",e);
        }

        Image image = Image.builder()
                .hotel(hotel)
                .url(uploadResult.get("secure_url").toString())
                .publicId(uploadResult.get("public_id").toString())
                .isMain(Boolean.TRUE.equals(isMain))
                .build();
        return mapper.toImageResponse(imageRepository.save(image));

    }

    @Override
    public List<ImageResponse> getByHotelId(Long hotelId) {
        return imageRepository.findByHotelId(hotelId).stream()
                .map(mapper::toImageResponse)
                .toList();
    }

    @Override
    public ImageResponse getMainImageByHotelId(Long hotelId) {
        Image image = imageRepository.findByHotelIdAndIsMainTrue(hotelId).orElseThrow(() -> new NotFoundException("MAIN IMAGE NOT FOUND. hotelID: " + hotelId));
        return mapper.toImageResponse(image);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Image image = imageRepository.findById(id).orElseThrow(() -> new NotFoundException("IMAGE NOT FOUND. ID: " + id));

        try {
            cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new CloudinaryException("ERROR WHILE DELETING THE IMAGE FROM CLOUDINARY.",e);
        }
        imageRepository.delete(image);
    }
}
