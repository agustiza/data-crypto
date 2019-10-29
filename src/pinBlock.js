const { numToHex, randomHexNibble, randomIntFromInterval } = require("./utils");

/**
 * @deprecated please use pinBlockFormat0
 */
function pinBlock(PAN, PIN) {
  return pinBlockFormat0(PAN, PIN);
}

/**
 * ISO 9564-1 Format 0. An `ISO-0` PIN block format is equivalent to the `ANSI X9.8`,` VISA-1`,
 * and `ECI-1` PIN block formats and is similar to a VISA-4 PIN block format.
 * @param {string} PAN 16 digits
 * @param {string} PIN supports a PIN from 4 to 12 digits in length.A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat0(PAN, PIN) {
  const PINLen = PIN.length;

  let preparedPIN = "0" + PINLen.toString(16) + PIN.padEnd(14, "F");

  let preparedPAN = PAN.slice(3, 15).padStart(16, "0");

  let clearPINblock = "";
  for (let i = 0; i < 16; i += 2) {
    let firstHex = parseInt(preparedPIN.substr(i, 2), 16);
    let secondHex = parseInt(preparedPAN.substr(i, 2), 16);

    clearPINblock = clearPINblock.concat(numToHex(firstHex ^ secondHex));
  }

  return clearPINblock.toUpperCase();
}

/**
 * ISO 9564-1:2003 Format 1. The `ISO-1` PIN block format is equivalent to an `ECI-4` PIN block format and is recommended for usage where no PAN data is available.
 * @param {string} PIN supports a PIN from 4 to 12 digits in length. A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat1(PIN) {
  const PINLen = PIN.length;

  let code = "1" + PINLen.toString(16) + PIN;

  for (let i = code.length; i < 16; i++) {
    code = code.concat(randomHexNibble());
  }

  return code.toUpperCase();
}

/**
 * ISO 9564-3: 2003 Format 2. `ISO-2` is for local use with off-line systems only.
 * @param {string} PIN supports a PIN from 4 to 12 digits in length. A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat2(PIN) {
  const PINLen = PIN.length;

  let code = "2" + PINLen.toString(16) + PIN.padEnd(14, "F");

  return code.toUpperCase();
}

/**
 * ISO 9564-1: 2002 Format 3. . `ISO-3`
 * @param {string} PAN 16 digits
 * @param {string} PIN supports a PIN from 4 to 12 digits in length.A PIN that is longer than 12 digits is truncated on the right.
 * @returns {string}
 */
function pinBlockFormat3(PAN, PIN) {
  const PINLen = PIN.length;

  let preparedPIN = "3" + PINLen.toString(16) + PIN;

  for (let i = preparedPIN.length; i < 16; i++) {
    const randomHexBetween10To15 = randomIntFromInterval(10, 15).toString(16);
    preparedPIN = preparedPIN.concat(randomHexBetween10To15);
  }

  let preparedPAN = PAN.slice(3, 15).padStart(16, "0");

  let clearPINblock = "";
  for (let i = 0; i < 16; i += 2) {
    let firstHex = parseInt(preparedPIN.substr(i, 2), 16);
    let secondHex = parseInt(preparedPAN.substr(i, 2), 16);

    clearPINblock = clearPINblock.concat(numToHex(firstHex ^ secondHex));
  }

  return clearPINblock.toUpperCase();
}

module.exports = {
  pinBlock,
  pinBlockFormat0,
  pinBlockFormat1,
  pinBlockFormat2,
  pinBlockFormat3,
};
