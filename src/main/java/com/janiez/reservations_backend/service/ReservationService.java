package com.janiez.reservations_backend.service;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.janiez.reservations_backend.entity.ReservationEntity;
import com.janiez.reservations_backend.entity.ReservationEstatus;
import com.janiez.reservations_backend.exception.ReservationBusinessException;
import com.janiez.reservations_backend.exception.ReservationNotFoundException;
import com.janiez.reservations_backend.repository.ReservationRepository;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(final ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public ReservationEntity create(
            final String customerName,
            final LocalDateTime date,
            final LocalTime time,
            final String service) {
        if (reservationRepository.existsByDateAndTimeAndStatus(date, time, ReservationEstatus.ACTIVE)) {
            throw new ReservationBusinessException(
                    "A reservation already exists for date " + date + " and time " + time);
        }

        final ReservationEntity reservation = new ReservationEntity();
        reservation.setCustomerName(customerName);
        reservation.setDate(date);
        reservation.setTime(time);
        reservation.setService(service);
        reservation.setStatus(ReservationEstatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public ReservationEntity cancel(final Long id) {
        final ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));

        if (reservation.getStatus() == ReservationEstatus.CANCELLED) {
            throw new ReservationBusinessException("Reservation with id " + id + " is already cancelled");
        }

        reservation.setStatus(ReservationEstatus.CANCELLED);
        return reservationRepository.save(reservation);
    }
}
