package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Positive
    private Double price;

    @NotBlank
    private String category;

    private String imageUrl;
    @JsonProperty("isTrending")
    @JsonAlias("trending")
    private boolean isTrending;
    private String sourcePlatform;
    private String productUrl;

    @NotNull
    private Long sellerId;

    @NotNull
    @Min(0)
    private Integer stockQuantity;
}
