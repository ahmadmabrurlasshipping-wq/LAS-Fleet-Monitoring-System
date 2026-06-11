/**
 * ============================================================================
 * LAS FLEET MONITORING SYSTEM - ENTERPRISE EDITION
 * PT. Pelayaran Lestari Abadi Serasi (PT. LAS Shipping Lines)
 * ============================================================================
 * File: Security.gs
 * Description: Input sanitisation, anti-spoofing constraints, and credential encoding.
 * ============================================================================
 */

var CRYPTO_SECRET = "PELAYARAN_LESTARI_ABADI_SERASI_2026_KEY";

/**
 * Filter alphanumeric strings to prevent script insertion on vessel/marine registries
 */
function Security_sanitizeString(str) {
  if (!str) return "";
  return str.toString()
    .replace(/[<>]/g, "") // Strip brackets
    .trim();
}

/**
 * Creates a crytographic verification token context for APIs
 */
function Security_generateAuthToken(email, role) {
  var timestamp = Date.now();
  var payload = email + "::" + role + "::" + timestamp;
  var signature = Auth_hashSHA256(payload + CRYPTO_SECRET);
  
  return Utilities.base64EncodeWebSafe(payload + "::" + signature);
}

/**
 * Parses and verifies security cookies / login sessions
 */
function Security_verifyAuthToken(token) {
  if (!token) return null;
  
  try {
    var rawStr = Utilities.newBlob(Utilities.base64Decode(token)).getDataAsString();
    var parts = rawStr.split("::");
    if (parts.length !== 4) return null;
    
    var email = parts[0];
    var role = parts[1];
    var timestamp = parts[2];
    var oldSig = parts[3];
    
    // Check if token expired (15-day session limit)
    var fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(timestamp) > fifteenDaysMs) {
      return null;
    }
    
    var reconstructedPayload = email + "::" + role + "::" + timestamp;
    var expectedSig = Auth_hashSHA256(reconstructedPayload + CRYPTO_SECRET);
    
    if (oldSig === expectedSig) {
      return {
        email: email,
        role: role,
        timestamp: timestamp
      };
    }
  } catch (err) {
    console.error("Token signature validation exception: " + err.message);
  }
  return null;
}
