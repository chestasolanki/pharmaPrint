/**
 * Geo-Temporal Telemetry & Impossible Travel Engine
 * Implements the Haversine formula and velocity bounds checking.
 */

const EARTH_RADIUS_KM = 6371; // Earth mean radius in kilometers
const MAX_REALISTIC_VELOCITY_KMH = 800; // Commercial aircraft cruise bounds

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  
  return parseFloat(distance.toFixed(1));
}

/**
 * Evaluates whether two consecutive scans for the same package represent impossible physical travel.
 */
export function evaluateTravelVelocity(scanA, scanB) {
  const distanceKm = calculateHaversineDistance(scanA.lat, scanA.lng, scanB.lat, scanB.lng);
  
  const timeA = new Date(scanA.timestamp).getTime();
  const timeB = new Date(scanB.timestamp).getTime();
  
  const deltaMillis = Math.abs(timeB - timeA);
  const deltaHours = deltaMillis / (1000 * 60 * 60);
  const deltaMinutes = parseFloat((deltaMillis / (1000 * 60)).toFixed(1));

  if (deltaHours === 0) {
    return {
      distanceKm,
      elapsedMinutes: 0,
      velocityKmh: 99999,
      isImpossibleTravel: distanceKm > 10,
      severity: 'CRITICAL',
      message: 'Concurrent verification event at two disjoint spatial nodes.'
    };
  }

  const velocityKmh = parseFloat((distanceKm / deltaHours).toFixed(1));
  const isImpossible = velocityKmh > MAX_REALISTIC_VELOCITY_KMH && distanceKm > 50;

  return {
    distanceKm,
    elapsedMinutes: deltaMinutes,
    velocityKmh,
    isImpossibleTravel: isImpossible,
    severity: velocityKmh > 2000 ? 'CRITICAL' : isImpossible ? 'HIGH' : 'LOW',
    message: isImpossible 
      ? `Calculated travel speed (${velocityKmh} km/h) exceeds physical threshold (${MAX_REALISTIC_VELOCITY_KMH} km/h). Serial reuse / clone detected.`
      : 'Physical travel velocity within acceptable logistical thresholds.'
  };
}
