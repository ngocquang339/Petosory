import L from 'leaflet';

// Fix for default Leaflet marker icon missing in bundled apps
delete L.Icon.Default.prototype._getIconUrl;

export const defaultMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const createPetPinIcon = (isSelected = false) => {
  const bgColor = isSelected ? '#ea580c' : '#f97316';
  const scale = isSelected ? 1.2 : 1.0;

  return L.divIcon({
    className: 'custom-pet-marker',
    html: `
      <div style="
        transform: scale(${scale});
        transform-origin: bottom center;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="
          background: ${bgColor};
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">🐾</span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 22px;
      height: 22px;
      background: #0ea5e9;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 5px rgba(14, 165, 233, 0.35);
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Trình duyệt không hỗ trợ định vị GPS'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};

