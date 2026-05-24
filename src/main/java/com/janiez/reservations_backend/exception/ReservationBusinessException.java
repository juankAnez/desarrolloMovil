package com.janiez.reservations_backend.exception;

public class ReservationBusinessException extends RuntimeException {

    public ReservationBusinessException(final String message) {
        super(message);
    }
}
