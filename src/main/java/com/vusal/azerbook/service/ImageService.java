package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.response.ImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {

    ImageResponse upload(Long hotelId, MultipartFile file, Boolean isMain);

    List<ImageResponse> getByHotelId(Long hotelId);

    ImageResponse getMainImageByHotelId(Long hotelId);

    void delete(Long id);

}
