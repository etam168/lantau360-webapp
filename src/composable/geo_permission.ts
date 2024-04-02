export enum GeolocationPermissionStatus {
  GRANTED = "granted",
  PROMPT = "prompt",
  DENIED = "denied"
}

export interface PermissionResult {
  status: GeolocationPermissionStatus;
  handleGeoPermission: () => void;
}

export function handlePermission(): Promise<PermissionResult> {
  return new Promise(resolve => {
    function handleGeoPermission() {
      const geoSettings: PositionOptions = {};

      navigator.permissions.query({ name: "geolocation" }).then((result: PermissionStatus) => {
        const status = result.state as GeolocationPermissionStatus;
        if (status === GeolocationPermissionStatus.PROMPT) {
          navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
        } else {
          resolve({ status, handleGeoPermission });
        }
        result.addEventListener("change", () => {
          resolve({ status, handleGeoPermission });
        });
      });
    }
    function revealPosition(position: GeolocationPosition) {
      console.info(position);
    }

    function positionDenied(error: GeolocationPositionError) {
      console.info(error);
    }

    handleGeoPermission();
  });
}
