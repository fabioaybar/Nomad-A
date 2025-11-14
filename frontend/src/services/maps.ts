import { Loader } from '@googlemaps/js-api-loader'
import type { Vehicle } from '../types'
import { createExternalApisGuard } from '../stores/settings'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
})

let googleMapsLoaded = false
let google: any = null

const ensureExternalApisEnabled = createExternalApisGuard()

export const loadGoogleMaps = async () => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  if (!googleMapsLoaded) {
    google = await loader.load()
    googleMapsLoaded = true
  }
  return google
}

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    })
  })
}

export const geocodeAddress = async (address: string) => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  await loadGoogleMaps()
  
  const geocoder = new google.maps.Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address,
        })
      } else {
        reject(new Error('Geocoding failed: ' + status))
      }
    })
  })
}

export const createMap = async (container: HTMLElement, options: any) => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  await loadGoogleMaps()
  return new google.maps.Map(container, options)
}

export const createMarker = async (options: any) => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  await loadGoogleMaps()
  return new google.maps.Marker(options)
}

export const createInfoWindow = async (options: any) => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  await loadGoogleMaps()
  return new google.maps.InfoWindow(options)
}

export const createVehicleMarkers = async (map: any, vehicles: Vehicle[], onMarkerClick?: (vehicle: Vehicle) => void) => {
  // TEMP FEATURE FLAG: ensure external APIs are enabled
  ensureExternalApisEnabled()
  await loadGoogleMaps()
  
  const markers: any[] = []
  
  vehicles.forEach((vehicle) => {
    const marker = new google.maps.Marker({
      position: { lat: vehicle.latitude, lng: vehicle.longitude },
      map: map,
      title: `${vehicle.make} ${vehicle.model}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.954 0 0 8.954 0 20c0 15 20 30 20 30s20-15 20-30C40 8.954 31.046 0 20 0z" fill="#3B82F6"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <text x="20" y="25" text-anchor="middle" fill="#3B82F6" font-size="12" font-family="Arial">🚗</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50),
      },
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width: 250px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <img src="${vehicle.images?.[0] || '/placeholder-car.jpg'}" 
                 alt="${vehicle.make} ${vehicle.model}" 
                 style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
            <div>
              <h3 style="margin: 0; font-size: 14px; font-weight: 600;">${vehicle.make} ${vehicle.model}</h3>
              <p style="margin: 0; color: #666; font-size: 12px;">${vehicle.year} • ${vehicle.type}</p>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: 600; color: #3B82F6;">$${vehicle.price_per_day}/day</span>
            <button onclick="window.viewVehicle('${vehicle.id}')" 
                    style="background: #3B82F6; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      `,
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
      if (onMarkerClick) {
        onMarkerClick(vehicle)
      }
    })

    markers.push({ marker, vehicle, infoWindow })
  })

  return markers
}