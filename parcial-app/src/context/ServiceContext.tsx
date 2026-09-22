import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceRequest, RequestStatus } from '../types/request';
import { ServiceItem } from '../types/service';
import { INITIAL_MOCK_REQUESTS } from '../data/mockRequests';
import { MOCK_CLIENT_USER, MOCK_PROVIDER_USER } from '../data/mockUsers';

interface ServiceContextType {
  requests: ServiceRequest[];
  createRequest: (service: ServiceItem, notes?: string) => ServiceRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  cancelRequest: (requestId: string) => void;
  getRequestById: (id: string) => ServiceRequest | undefined;
  stepProviderLocation: (requestId: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_MOCK_REQUESTS);

  // Function to create a new request in PENDING status
  const createRequest = (service: ServiceItem, notes?: string): ServiceRequest => {
    const newReq: ServiceRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      service,
      client: MOCK_CLIENT_USER,
      provider: MOCK_PROVIDER_USER,
      status: 'PENDING',
      createdAt: 'Justo ahora',
      updatedAt: 'Justo ahora',
      clientLocation: {
        latitude: MOCK_CLIENT_USER.latitude,
        longitude: MOCK_CLIENT_USER.longitude,
        label: MOCK_CLIENT_USER.address,
      },
      providerCurrentLocation: {
        latitude: service.provider.latitude,
        longitude: service.provider.longitude,
        label: service.provider.neighborhood,
      },
      estimatedDistanceKm: service.distanceKm,
      estimatedArrivalMinutes: Math.round(service.distanceKm * 6),
      notes: notes || 'Solicitud generada desde la aplicación móvil',
    };

    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  // Real state transition
  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          // If entering ON_THE_WAY, set provider nearby
          const isEnCamino = status === 'ON_THE_WAY';
          return {
            ...req,
            status,
            updatedAt: 'Hace un momento',
            estimatedArrivalMinutes: isEnCamino ? 5 : req.estimatedArrivalMinutes,
          };
        }
        return req;
      })
    );
  };

  const cancelRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'CANCELLED');
  };

  const getRequestById = (id: string): ServiceRequest | undefined => {
    return requests.find((r) => r.id === id);
  };

  // Simulates GPS movement during ON_THE_WAY
  const stepProviderLocation = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId && req.status === 'ON_THE_WAY') {
          // Linear interpolation towards client
          const targetLat = req.clientLocation.latitude;
          const targetLng = req.clientLocation.longitude;
          const curLat = req.providerCurrentLocation.latitude;
          const curLng = req.providerCurrentLocation.longitude;

          const nextLat = curLat + (targetLat - curLat) * 0.35;
          const nextLng = curLng + (targetLng - curLng) * 0.35;

          const newDist = Math.max(0.1, Number((req.estimatedDistanceKm * 0.65).toFixed(1)));
          const newEta = Math.max(1, Math.round(newDist * 4));

          return {
            ...req,
            providerCurrentLocation: {
              latitude: nextLat,
              longitude: nextLng,
              label: 'Aproximándose por Carrera 10, Riohacha',
            },
            estimatedDistanceKm: newDist,
            estimatedArrivalMinutes: newEta,
          };
        }
        return req;
      })
    );
  };

  // Periodically advance provider location if in ON_THE_WAY for live demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      requests.forEach((r) => {
        if (r.status === 'ON_THE_WAY') {
          stepProviderLocation(r.id);
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [requests]);

  return (
    <ServiceContext.Provider
      value={{
        requests,
        createRequest,
        updateRequestStatus,
        cancelRequest,
        getRequestById,
        stepProviderLocation,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
