/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Drive.gs
 * Description: Google Drive integration, automatic folder structural assembly.
 * ============================================================================
 */

var ROOT_FOLDER_NAME = "LAS_FLEET_SYSTEM";

/**
 * Confirms or creates the root 'LAS_FLEET_SYSTEM' Google Drive folder,
 * returning the unique ID token of that folder.
 */
function Drive_getOrCreateRootFolder() {
  try {
    var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
    if (folders.hasNext()) {
      return folders.next().getId();
    }
    
    // Create new root folder if none exists
    var rootFolder = DriveApp.createFolder(ROOT_FOLDER_NAME);
    console.log("Automatically created system root folder: " + ROOT_FOLDER_NAME);
    
    // Create operational subdirectories
    rootFolder.createFolder("VESSEL_CERTIFICATES");
    rootFolder.createFolder("CREW_STCW_DOCUMENTS");
    rootFolder.createFolder("VOYAGE_LOGBOOKS");
    
    return rootFolder.getId();
  } catch (err) {
    console.error("Failed to compile directory folders hierarchy: " + err.message);
    throw new Error("Google Drive access limits or permissions denied: " + err.message);
  }
}

/**
 * Handle server-side upload of raw base64 binary files received from custom pickers or file UI elements
 */
function Drive_handleUpload(fileBase64, fileName, mimeType, categorySubfolder) {
  if (!fileBase64 || !fileName) {
    throw new Error("Missing binary context or filename. Upload aborted.");
  }
  
  var rootId = Drive_getOrCreateRootFolder();
  var parentFolder = DriveApp.getFolderById(rootId);
  
  // Custom folder nesting based on category
  if (categorySubfolder) {
    var subfolders = parentFolder.getFoldersByName(categorySubfolder);
    if (subfolders.hasNext()) {
      parentFolder = subfolders.next();
    } else {
      parentFolder = parentFolder.createFolder(categorySubfolder);
    }
  }
  
  var decodedBytes = Utilities.base64Decode(fileBase64);
  var blob = Utilities.newBlob(decodedBytes, mimeType || "application/pdf", fileName);
  
  var driveFile = parentFolder.createFile(blob);
  
  // Enable anyone with the link to view the certificate file (great for inspections)
  driveFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  
  return {
    id: driveFile.getId(),
    name: driveFile.getName(),
    url: driveFile.getUrl(),
    downloadUrl: driveFile.getDownloadUrl()
  };
}
