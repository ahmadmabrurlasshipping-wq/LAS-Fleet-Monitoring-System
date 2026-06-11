/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Auth.gs
 * Description: Secure authentication module utilizing SHA-256 hashing.
 * ============================================================================
 */

/**
 * Computes a standard SHA-256 hex string digest of the input
 * @param {string} input - The password or text to hash
 * @return {string} SHA-256 hexadecimal string
 */
function Auth_hashSHA256(input) {
  if (!input) return "";
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    input, 
    Utilities.Charset.UTF_8
  );
  
  var hexString = "";
  for (var i = 0; i < rawHash.length; i++) {
    var value = rawHash[i];
    if (value < 0) {
      value += 256;
    }
    var byteString = value.toString(16);
    if (byteString.length === 1) {
      byteString = "0" + byteString;
    }
    hexString += byteString;
  }
  return hexString;
}

/**
 * Validates credentials against recorded user registry
 * @param {string} email - Sailor or Admin email address
 * @param {string} password - Raw password
 * @return {object} User account metadata if success, throws otherwise
 */
function Auth_login(email, password) {
  if (!email || !password) {
    throw new Error("Parameters email and password are required.");
  }
  
  email = Security_sanitizeString(email.toLowerCase().trim());
  var passwordHash = Auth_hashSHA256(password);
  
  // Connect to global system properties representing our user database
  var userRecordStr = CacheService.getScriptCache().get("user_" + email);
  if (!userRecordStr) {
    userRecordStr = PropertiesService.getScriptProperties().getProperty("user_" + email);
  }
  
  if (!userRecordStr) {
    // Seed default administrator if DB is blank for instant bootstrap
    if (email === "admin@las.co.id") {
      var defaultAdmin = {
        email: "admin@las.co.id",
        passwordHash: Auth_hashSHA256("lasadmin123"),
        role: "SYSTEM_ADMINISTRATOR",
        name: "Direktur PT. LAS Shipping",
        status: "ACTIVE"
      };
      PropertiesService.getScriptProperties().setProperty("user_admin@las.co.id", JSON.stringify(defaultAdmin));
      userRecordStr = JSON.stringify(defaultAdmin);
    } else {
      throw new Error("Sailor email or administrative credentials not registered.");
    }
  }
  
  var userRecord = JSON.parse(userRecordStr);
  
  if (userRecord.passwordHash !== passwordHash) {
    throw new Error("Invalid password provided.");
  }
  
  if (userRecord.status !== "ACTIVE") {
    throw new Error("User account is currently suspended.");
  }
  
  // Return sanitised token context
  return {
    email: userRecord.email,
    role: userRecord.role,
    name: userRecord.name || "Staf PT. LAS",
    token: Security_generateAuthToken(userRecord.email, userRecord.role)
  };
}

/**
 * Registers a new user inside PT. LAS identity registry
 */
function Auth_register(email, password, role) {
  if (!email || !password || !role) {
    throw new Error("Missing alignment records. Email, password, and enterprise role are required.");
  }
  
  email = Security_sanitizeString(email.toLowerCase().trim());
  role = Security_sanitizeString(role.toUpperCase());
  
  var existing = PropertiesService.getScriptProperties().getProperty("user_" + email);
  if (existing) {
    throw new Error("Email has already been registered inside PT. LAS databases.");
  }
  
  var newUser = {
    email: email,
    passwordHash: Auth_hashSHA256(password),
    role: role,
    name: email.split("@")[0].toUpperCase(),
    status: "ACTIVE",
    registeredAt: new Date().toISOString()
  };
  
  PropertiesService.getScriptProperties().setProperty("user_" + email, JSON.stringify(newUser));
  return {
    email: email,
    role: role,
    success: true
  };
}
