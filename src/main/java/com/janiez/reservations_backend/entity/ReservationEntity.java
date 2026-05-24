package com.janiez.reservations_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Entity
@Table(name = "reservations")
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private LocalDateTime date;
    private LocalTime time;
    private String service;
    private ReservationEstatus status;
    public ReservationEntity(Long id, String customerName, LocalDateTime date, LocalTime time, String service,
            ReservationEstatus status) {
        this.id = id;
        this.customerName = customerName;
        this.date = date;
        this.time = time;
        this.service = service;
        this.status = status;
    }
    public ReservationEntity() {
    }
    public Long getId() {
        return id;
    }
    public String getCustomerName() {
        return customerName;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public LocalTime getTime() {
        return time;
    }
    public String getService() {
        return service;
    }
    public ReservationEstatus getStatus() {
        return status;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public void setTime(LocalTime time) {
        this.time = time;
    }
    public void setService(String service) {
        this.service = service;
    }
    public void setStatus(ReservationEstatus status) {
        this.status = status;
    }


    

}
