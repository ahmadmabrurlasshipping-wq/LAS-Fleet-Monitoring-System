/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Code.gs
 * Description: Core Entry Point, Router, and global function exporter for Google Apps Script Web App.
 * Author: Senior Full-Stack Software Architect & Fleet Management Expert
 * ============================================================================
 */

// Global constant definition
var APP_TITLE = "LAS Fleet Monitoring System — Enterprise Edition";

/**
 * Handle HTTP GET request to serve the active web interface
 * Supports embedding inside GAS iframe context
 */
function doGet(e) {
  try {
    var template = HtmlService.createTemplateFromFile("index");
    return template.evaluate()
      .setTitle(APP_TITLE)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return HtmlService.createHtmlOutput(
      "<h3>System Bootstrap Error</h3><p>" + err.message + "</p>"
    );
  }
}

/**
 * Utility function to include external HTML parts inside index.html templates
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper to standardise JSON API response structures across remote calls
 */
function apiResponse(success, data, errorMsg) {
  return {
    success: success,
    timestamp: new Date().toISOString(),
    data: data || null,
    error: errorMsg || null
  };
}

/**
 * Global execution wrapper for error handling on RPC calls
 */
function executeRpc(callback, args) {
  try {
    initDatabaseIfNeeded();
    var result = callback.apply(null, args);
    return apiResponse(true, result, null);
  } catch (err) {
    console.error("RPC execution failure: " + err.message);
    return apiResponse(false, null, err.message);
  }
}

/**
 * EXPOSED FUNCTIONS FOR CLIENT-SIDE COMMUNICATION (google.script.run)
 * Direct mapping to our modular subfiles
 */

function authenticateUser(email, password) {
  return executeRpc(Auth_login, [email, password]);
}

function registerUser(email, password, role) {
  return executeRpc(Auth_register, [email, password, role]);
}

function getVesselRegistry() {
  return executeRpc(Fleet_getRegistry, []);
}

function updateVesselLocation(vesselId, latitude, longitude, speed, heading, status, notes) {
  return executeRpc(Fleet_updateLocation, [vesselId, latitude, longitude, speed, heading, status, notes]);
}

function getCrewList() {
  return executeRpc(Crew_getList, []);
}

function addCrewMember(crewData) {
  return executeRpc(Crew_addMember, [crewData]);
}

function logCrewWorkingHours(crewId, date, hoursWorked, restHours, taskId, remarks) {
  return executeRpc(Crew_logHours, [crewId, date, hoursWorked, restHours, taskId, remarks]);
}

function getVesselCertificates(vesselId) {
  return executeRpc(Document_getVesselCertificates, [vesselId]);
}

function addVesselCertificate(certData) {
  return executeRpc(Document_addVesselCertificate, [certData]);
}

function getCrewCertificates(crewId) {
  return executeRpc(Document_getCrewCertificates, [crewId]);
}

function addCrewCertificate(certData) {
  return executeRpc(Document_addCrewCertificate, [certData]);
}

function getRotationSchedules() {
  return executeRpc(Rotation_getSchedules, []);
}

function updateRotationStatus(scheduleId, nextStatus) {
  return executeRpc(Rotation_updateStatus, [scheduleId, nextStatus]);
}

function getRecentNotifications() {
  return executeRpc(Notification_getRecent, []);
}

function handlePickerFileUpload(fileBase64, fileName, mimeType, parentFolderToken) {
  return executeRpc(Drive_handleUpload, [fileBase64, fileName, mimeType, parentFolderToken]);
}
