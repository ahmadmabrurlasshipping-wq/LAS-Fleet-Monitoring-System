/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Crew.gs
 * Description: Maritime STCW compliance & MLC 2006 Rest Hour Log auditor.
 * ============================================================================
 */

/**
 * Return all registered seafarers
 */
function Crew_getList() {
  return Database_read("Crew");
}

/**
 * Add a new seaman to the active database
 * Enforces STCW and basic bio-data integrity
 */
function Crew_addMember(crewData) {
  if (!crewData.name || !crewData.rank) {
    throw new Error("Sailor Name and STCW Rank is mandatory.");
  }
  
  var crewList = Crew_getList();
  var newId = "crew_" + Date.now();
  
  var newCrew = {
    id: newId,
    name: Security_sanitizeString(crewData.name),
    rank: Security_sanitizeString(crewData.rank),
    vessel: crewData.vessel || "",
    nationality: crewData.nationality || "Indonesia",
    passport: Security_sanitizeString(crewData.passport || ""),
    seamanbook: Security_sanitizeString(crewData.seamanbook || ""),
    dob: crewData.dob || "",
    status: crewData.status || "standby",
    coc: Security_sanitizeString(crewData.coc || ""),
    cocExp: crewData.cocExp || "",
    medExp: crewData.medExp || ""
  };
  
  crewList.unshift(newCrew);
  Database_write("Crew", crewList);
  return newCrew;
}

/**
 * Logs sailor fatigue indexes and tests against MLC (Maritime Labour Convention) 2006 Regulation
 * Max limits: 14 working hours in any 24-hour period, min 10 rest hours
 * @param {string} crewId - Target Crew ID
 * @param {string} date - Log date
 * @param {number} hoursWorked - Total service hours logged
 * @param {number} restHours - Total rest hours log
 */
function Crew_logHours(crewId, date, hoursWorked, restHours, taskId, remarks) {
  if (!crewId || !date) {
    throw new Error("Incomplete fatigue metrics payload. Crew and Date are required.");
  }
  
  tasksId = taskId || "Watchkeeping";
  remarks = Security_sanitizeString(remarks || "");
  hoursWorked = parseFloat(hoursWorked);
  restHours = parseFloat(restHours);
  
  var isMlcViolation = false;
  var violationDetails = "";
  
  // Rule 1: Working hours must not exceed 14 hours in 24 hours
  if (hoursWorked > 14.0) {
    isMlcViolation = true;
    violationDetails += "Working hours (" + hoursWorked + " hrs) exceeded MLC 2006 Limit (Max 14 hrs). ";
  }
  
  // Rule 2: Rest hours must be at least 10 hours
  if (restHours < 10.0) {
    isMlcViolation = true;
    violationDetails += "Rest hours (" + restHours + " hrs) was below MLC 2006 requirements (Min 10 hrs).";
  }

  var logEntry = {
    id: "log_" + Date.now(),
    crewId: crewId,
    date: date,
    hoursWorked: hoursWorked,
    restHours: restHours,
    isViolation: isMlcViolation,
    violationMessage: violationDetails,
    loggedAt: new Date().toISOString()
  };
  
  var mlcList = Database_read("MlcLogs");
  mlcList.unshift(logEntry);
  Database_write("MlcLogs", mlcList);
  
  // If violation occurs, trigger alert immediately on the notification channel
  if (isMlcViolation) {
    Notification_triggerMlcAlert(crewId, violationDetails, date);
  }
  
  return logEntry;
}

/**
 * Audit crew certificate expirations against STCW requirements
 * Helper to notify the operations desk directly
 */
function Crew_auditStcwCompliance() {
  var crewList = Crew_getList();
  var currentDate = new Date();
  var nonCompliant = [];
  
  for (var i = 0; i < crewList.length; i++) {
    var c = crewList[i];
    if (c.status !== "onboard") continue;
    
    // Check Marine Medical Certificate (validity check)
    var medExp = new Date(c.medExp);
    var cocExp = new Date(c.cocExp);
    
    if (medExp <= currentDate || cocExp <= currentDate) {
      nonCompliant.push({
        crewId: c.id,
        name: c.name,
        rank: c.rank,
        expiredMedical: medExp <= currentDate,
        expiredCoc: cocExp <= currentDate
      });
    }
  }
  
  return nonCompliant;
}
