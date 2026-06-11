/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Rotation.gs
 * Description: Crew Rotation & Shift Scheduler (Kanban Alignment).
 * ============================================================================
 */

/**
 * Fetch all active and planned crew rotations
 */
function Rotation_getSchedules() {
  return Database_read("Schedules");
}

/**
 * Creates/schedules a duty rotation sequence for a crew member
 */
function Rotation_createSchedule(rotationData) {
  if (!rotationData.crewId || !rotationData.vesselId) {
    throw new Error("Parameters crewId and vesselId are required for operational scheduling.");
  }
  
  var schedules = Rotation_getSchedules();
  var newId = "rot_" + Date.now();
  
  var newRot = {
    id: newId,
    crewId: rotationData.crewId,
    vesselId: rotationData.vesselId,
    rank: rotationData.rank,
    signOn: rotationData.signOn || "",
    signOff: rotationData.signOff || "",
    status: rotationData.status || "planned", // planned (Standby), onboard, leave
    port: Security_sanitizeString(rotationData.port || "Samarinda"),
    notes: Security_sanitizeString(rotationData.notes || "")
  };
  
  schedules.unshift(newRot);
  Database_write("Schedules", schedules);
  
  // Update crew status to reflect schedule state change immediately
  Rotation_syncCrewState(rotationData.crewId, rotationData.vesselId, newRot.status);
  
  return newRot;
}

/**
 * Progress rotation state for scheduling Kanban interfaces
 * @param {string} scheduleId - Target Schedule Code
 * @param {string} nextStatus - 'planned' | 'onboard' | 'leave'
 */
function Rotation_updateStatus(scheduleId, nextStatus) {
  var schedules = Rotation_getSchedules();
  var found = false;
  var matchedItem = null;
  
  for (var i = 0; i < schedules.length; i++) {
    if (schedules[i].id === scheduleId) {
      schedules[i].status = nextStatus;
      matchedItem = schedules[i];
      found = true;
      break;
    }
  }
  
  if (!found || !matchedItem) {
    throw new Error("Schedule rotation ID not found.");
  }
  
  Database_write("Schedules", schedules);
  
  // Sync core crew registry with the new rot status
  Rotation_syncCrewState(matchedItem.crewId, matchedItem.vesselId, nextStatus);
  
  return { id: scheduleId, status: nextStatus, success: true };
}

/**
 * Updates status of crew member on the central database during crew change
 */
function Rotation_syncCrewState(crewId, vesselId, status) {
  var crewList = Crew_getList();
  
  for (var i = 0; i < crewList.length; i++) {
    if (crewList[i].id === crewId) {
      if (status === "onboard") {
        crewList[i].status = "onboard";
        crewList[i].vessel = vesselId;
      } else if (status === "leave") {
        crewList[i].status = "leave";
        crewList[i].vessel = ""; // Return to pool / home leave
      } else {
        crewList[i].status = "standby"; // Standard pool standby
      }
      break;
    }
  }
  
  Database_write("Crew", crewList);
}
