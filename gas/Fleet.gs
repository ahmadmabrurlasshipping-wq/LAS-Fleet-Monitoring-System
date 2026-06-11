/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Fleet.gs
 * Description: Fleet tracking, position updates, and draft diagnostics.
 * ============================================================================
 */

/**
 * Access all vessels registered inside our fleet
 */
function Fleet_getRegistry() {
  return Database_read("Vessels");
}

/**
 * Updates coordinates and telemetry for real-time fleet map rendering
 * @param {string} vesselId - Vessel code
 * @param {number} latitude - Floating point latitude
 * @param {number} longitude - Floating point longitude
 * @param {number} speed - Knots
 * @param {number} heading - Gyro degrees
 * @param {string} status - operational | route | drydock
 * @param {string} notes - Current status details
 */
function Fleet_updateLocation(vesselId, latitude, longitude, speed, heading, status, notes) {
  var vessels = Fleet_getRegistry();
  var found = false;
  
  for (var i = 0; i < vessels.length; i++) {
    if (vessels[i].id === vesselId) {
      vessels[i].location = latitude + "N, " + longitude + "E";
      vessels[i].speed = speed ? parseFloat(speed) : 0;
      vessels[i].heading = heading ? parseFloat(heading) : 0;
      vessels[i].status = status || vessels[i].status;
      vessels[i].notes = Security_sanitizeString(notes || "");
      vessels[i].lastUpdated = new Date().toISOString();
      found = true;
      break;
    }
  }
  
  if (!found) {
    throw new Error("Vessel ID not registered in PT. LAS records.");
  }
  
  Database_write("Vessels", vessels);
  return { id: vesselId, success: true };
}

/**
 * Registers an operational incident (spill, breakdown, groundings) to track maritime safety logs
 */
function Fleet_logIncidents(vesselId, level, message) {
  var incidents = Database_read("Incidents") || [];
  var newIncident = {
    id: "inc_" + Date.now(),
    vesselId: vesselId,
    timestamp: new Date().toISOString(),
    severity: level, // low | medium | high
    description: Security_sanitizeString(message),
    status: "OPEN"
  };
  
  incidents.unshift(newIncident);
  Database_write("Incidents", incidents);
  
  // High-severity issues alert operations desk instantly
  if (level === "high" || level === "critical") {
    Notification_telegramBroadcast("[URGENT MARITIME INCIDENT] Vessel " + vesselId + " reported: " + message);
  }
}
