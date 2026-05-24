package com.janiez.reservations_backend.repository;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.janiez.reservations_backend.entity.ReservationEntity;
import com.janiez.reservations_backend.entity.ReservationEstatus;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    boolean existsByDateAndTimeAndStatus(LocalDateTime date, LocalTime time, ReservationEstatus status);
}
