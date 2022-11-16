import { CUSTOM_IV, CUSTOM_SECRET_KEY } from "../../../../utils/ble/BleEncryptionConstants"
import { bytesToHex } from "../../../../utils/ble/BleUtil"
import { arrayCopy } from "../../../../utils/common/CommonUtil"
import Constants from "../../../../utils/Constants"
import { logDebug } from "../../../../utils/logger/Logger"


const LOG_TAG = Constants.LOG.BT_CRYPTO

/**
 * load crypto module.
 */
const CryptoJS = require("crypto-js")

const Encryptor = () => {

    /**
     * encrypt ble custom message and return it.
     * @param {bytes} data
     * @returns {Any}
     */
    getEncryptedBytes = (message, key = CUSTOM_SECRET_KEY, iv = CUSTOM_IV) => {

        logDebug(LOG_TAG, ">>> message: " + message)
        logDebug(LOG_TAG, ">>> key: " + key)
        logDebug(LOG_TAG, ">>> iv: " + iv)

        // crypto encryptor.
        const cipheredData =
            CryptoJS.AES.encrypt(message, key, {
                iv: iv,
                padding: CryptoJS.pad.NoPadding,
                mode: CryptoJS.mode.CBC
            })

        logDebug(LOG_TAG, "<<< encryption result ------------------------------------------------------------------")
        // logDebug(LOG_TAG, "<<< encryption, cipheredData: " + cipheredData)
        logDebug(LOG_TAG, "<<< encryption, cipheredData.ciphertext: " + cipheredData.ciphertext)
        logDebug(LOG_TAG, "<<< encryption, cipheredData.ciphertext.length: " + cipheredData.ciphertext.length)
        logDebug(LOG_TAG, "<<< encryption result end --------------------------------------------------------------")

        // let cipheredArrayData = new Array(cipheredData.ciphertext.length / 2)
        // for (let i = 0; i < cipheredArrayData.length; i++) {
        //     const item = cipheredData.ciphertext.toString().substr(i + i, 2)
        //     cipheredArrayData[i] = item
        // }
        // logDebug(LOG_TAG, "<<< encryption, cipheredData array: " + cipheredArrayData)
        return cipheredArrayData
    }

    /**
     * apply padding algorithm to data and return it.
     * @param {Any} data
     * @returns {Any}
     */
    getPaddedData = (data) => {

        logDebug(LOG_TAG, ">>> data before padding algorithm is applied: " + data)

        const dataLength = data.length
        const dataLengthDividedByTwo = dataLength / 2
        const padding = 16 - (dataLengthDividedByTwo % 16)
        const paddingAsInt = parseInt(padding, 16)
        const bufferLength = ((dataLengthDividedByTwo + 16) / 16) * 16

        logDebug(LOG_TAG, ">>> padding related data, "
            + "original dataLength: " + dataLength
            + ", data length divided by 2: " + dataLengthDividedByTwo
            + ", paddingValue: " + padding
            + ", destination buffer lLength: " + bufferLength)

        let destination = new Array(bufferLength)

        let source = new Array(dataLengthDividedByTwo)
        for (let i = 0; i < source.length; i++) {
            const item = data.substr(i + i, 2)
            source[i] = item
        }
        arrayCopy(source, 0, destination, 0, dataLengthDividedByTwo)

        for (let i = dataLengthDividedByTwo; i < destination.length; i++) {
            if (paddingAsInt < 10) {
                destination[i] = "0" + padding
            } else {
                destination[i] = padding
            }
        }

        let paddingResult = ""
        for (let i = 0; i < destination.length; i++) {
            paddingResult += destination[i]
        }

        logDebug(LOG_TAG, ">>> padding, destination buffer: " + destination)

        logDebug(LOG_TAG, ">>> padding, result: " + paddingResult)

        return paddingResult
    }

    /**
     * decrypt ble custom data and return it.
     * @param {Any} data
     * @returns {Any}
     */
    getDecryptedBytes = (data) => {

        // crypto decryptor.
        let decryptedData = CryptoJS.AES.decrypt(data, CUSTOM_SECRET_KEY, {
            iv: CUSTOM_IV,
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.CBC
        })

        logDebug(LOG_TAG, "<<< decryption, decryption result: " + decryptedData.toString())

        const depaddedData = getDepaddedData(decryptedData)
        return depaddedData
    }

    /**
     * apply de-padding algorithm to data and return it.
     * @param {Any} data 
     * @returns {Any}
     */
    const getDepaddedData = (data) => {

        let dataAsString = data.toString()

        const dataLength = dataAsString.length
        const dataLengthDividedByTwo = dataLength / 2
        const padding = dataAsString.substr(dataLength - 2, 2)
        const paddingAsInt = parseInt(padding, 16)
        const bufferLength = dataLengthDividedByTwo - paddingAsInt

        logDebug(LOG_TAG, ">>> depadding, "
            + "data length: " + dataLength
            + ", data length divided by 2: " + dataLengthDividedByTwo
            + ", padding: " + padding
            + ", paddingAsInt: " + paddingAsInt
            + ", bufferLength: " + bufferLength)

        let destination = new Array(bufferLength)
        let source = new Array(dataLengthDividedByTwo)

        for (let i = 0; i < source.length; i++) {
            const item = dataAsString.substr(i + i, 2)
            source[i] = item
        }

        arrayCopy(source, 0, destination, 0, dataLengthDividedByTwo - paddingAsInt)

        let depaddingResult = ""
        for (let i = 0; i < destination.length; i++) {
            depaddingResult += destination[i]
        }

        logDebug(LOG_TAG, ">>> depadding, result: " + depaddingResult)
        logDebug(LOG_TAG, ">>> depadding, destination buffer: " + destination)

        return depaddingResult
    }

    return {
        getEncryptedBytes,
        getDecryptedBytes
    }
}

export default Encryptor