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
    className: 'custom-spa-pin',
    html: `
      <div style="width:34px;height:34px;background:${bgColor};border-radius:50% 50% 50% 0;transform:rotate(-45deg) scale(${scale});display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.6);transition:transform 0.2s ease;">
        <svg style="transform:rotate(45deg);width:18px;height:18px;fill:#0f172a;" viewBox="0 0 512 512">
          <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.6 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.8c0 44.2-35.8 80-80 80c-28.8 0-54.6-15.3-69-38.4l-21.7-34.7c-7.9-12.6-26.2-12.6-34.1 0l-21.7 34.7c-14.4 23.1-40.2 38.4-69 38.4c-44.2 0-80-35.8-80-80c0-10.7 1.6-21.1 5.2-30.8zM411.6 198.6c-18.9 32.4-54.1 47.3-78.5 33.3s-29.1-51.7-10.2-84.1s54.1-47.3 78.5-33.3s29.1 51.7 10.2 84.1zM285.5 92.9c14.3-42.9 52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5s-46.9-53.9-32.6-96.8z"/>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
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
