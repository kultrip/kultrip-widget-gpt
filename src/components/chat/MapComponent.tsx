import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY || 'pk.eyJ1Ijoia3VsdHJpcCIsImEiOiJjbThjYzZtYmcxdXJ5MmpyN250Ym9mM28yIn0.tB4lKBihQDhgp6DRkDT8lQ';

interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  description?: string;
  type?: 'activity' | 'accommodation' | 'restaurant' | 'transport' | 'landmark';
}

interface MapComponentProps {
  locations: Location[];
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ locations, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: locations.length > 0 ? locations[0].coordinates : [-0.1276, 51.5074], // Default to London
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || locations.length === 0) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each location
    locations.forEach((location, index) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
      `;
      markerElement.textContent = (index + 1).toString();

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #1f2937;">${location.name}</h3>
            ${location.description ? `<p style="margin: 0; font-size: 14px; color: #6b7280;">${location.description}</p>` : ''}
          </div>
        `);

      // Create marker and add to map
      new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit map to show all locations
    if (locations.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => bounds.extend(location.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    } else if (locations.length === 1) {
      map.current.setCenter(locations[0].coordinates);
      map.current.setZoom(14);
    }
  }, [locations]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-64 rounded-lg border border-border ${className}`}
      style={{ minHeight: '256px' }}
    />
  );
};

export default MapComponent;