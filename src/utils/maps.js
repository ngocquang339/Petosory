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
  const scale = isSelected ? 1.25 : 1.0;

  return L.divIcon({
    className: 'custom-pet-marker',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.6));
        transform: scale(${scale});
        transition: transform 0.25s ease;
      ">
        <svg width="34" height="44" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${bgColor}" stroke="#ffffff" stroke-width="1.8" />
        </svg>
        <div style="
          position: absolute;
          top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          line-height: 1;
        ">
          🐾
        </div>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -44],
  });
};

export const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 30px;
        height: 30px;
        background: rgba(14, 165, 233, 0.4);
        border-radius: 50%;
        animation: pulse 1.8s infinite;
      "></div>
      <div style="
        width: 14px;
        height: 14px;
        background: #0ea5e9;
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(14, 165, 233, 0.9);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
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
