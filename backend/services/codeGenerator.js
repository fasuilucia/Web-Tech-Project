const crypto = require('crypto');
const QRCode = require('qrcode');

/**
 * Generates a unique alphanumeric access code
 * @param {number} length - Length of the code (default: 8)
 * @returns {string} Unique access code
 */
const generateAccessCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        code += characters[randomIndex];
    }

    return code;
};

/**
 * Generates a QR code data URL from access code
 * @param {string} accessCode - The access code to encode
 * @returns {Promise<string>} Base64 encoded QR code data URL
 */
const generateQRCode = async (accessCode) => {
    try {
        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(accessCode, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 400,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

/**
 * Generates both access code and QR code
 * @returns {Promise<Object>} Object containing accessCode and qrCodeData
 */
const generateEventCodes = async () => {
    const accessCode = generateAccessCode();
    const qrCodeData = await generateQRCode(accessCode);

    return {
        accessCode,
        qrCodeData,
    };
};

module.exports = {
    generateAccessCode,
    generateQRCode,
    generateEventCodes,
};
