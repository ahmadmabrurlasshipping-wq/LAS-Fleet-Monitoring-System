/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Document.gs
 * Description: Vessel and Crew marine document registries.
 * ============================================================================
 */

function Document_getVesselCertificates(vesselId) {
  var certList = Database_read("Certificates");
  if (!vesselId) return certList;
  
  return certList.filter(function(item) {
    return item.vesselId === vesselId;
  });
}

/**
 * Commits a new vessel document certificate link to the system
 * Integrates alerts if certificate has expiration dates
 */
function Document_addVesselCertificate(certData) {
  if (!certData.name || !certData.vesselId) {
    throw new Error("Missing alignment fields. Vessel ID and Certificate Name are mandatory.");
  }
  
  var certList = Database_read("Certificates");
  var newId = "cert_" + Date.now();
  
  var newCert = {
    id: newId,
    vesselId: certData.vesselId,
    type: certData.type || "Safety",
    name: Security_sanitizeString(certData.name.toUpperCase()),
    issuer: Security_sanitizeString(certData.issuer || "DJPL"),
    issue: certData.issue || "",
    expiry: certData.expiry || "",
    driveUrl: certData.driveUrl || "",
    driveName: certData.driveName || "",
    notes: Security_sanitizeString(certData.notes || "")
  };
  
  certList.unshift(newCert);
  Database_write("Certificates", certList);
  return newCert;
}

function Document_getCrewCertificates(crewId) {
  var docList = Database_read("CrewCertificates") || [];
  if (!crewId) return docList;
  
  return docList.filter(function(item) {
    return item.crewId === crewId;
  });
}

function Document_addCrewCertificate(certData) {
  if (!certData.crewId || !certData.docNumber) {
    throw new Error("Missing alignment fields. Crew ID and Document Number are required.");
  }
  
  var docList = Database_read("CrewCertificates") || [];
  var newId = "cdoc_" + Date.now();
  
  var newDoc = {
    id: newId,
    crewId: certData.crewId,
    type: certData.type || "COC",
    docNumber: Security_sanitizeString(certData.docNumber.toUpperCase()),
    issuer: Security_sanitizeString(certData.issuer || "DJPL"),
    issue: certData.issue || "",
    expiry: certData.expiry || "",
    status: certData.status || "valid",
    driveUrl: certData.driveUrl || "",
    driveName: certData.driveName || ""
  };
  
  docList.unshift(newDoc);
  Database_write("CrewCertificates", docList);
  return newDoc;
}
