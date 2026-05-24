package com.janiez.reservations_backend.exception;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(final Long id) {
        super("Reservation not found with id: " + id);
    }
}
