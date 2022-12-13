import UrlRepository from "../../../data/repositories/url/UrlRepository"
import { logDebug } from "../../../utils/logger/Logger"
import { hasValidPhoneNumber } from "../../../utils/regex/RegexUtil"

const LOG_TAG = "GetDecryptedPhoneNumberUseCase"

function GetDecryptedPhoneNumberUseCase() {

    const { decryptDeviceMobileNumber } = UrlRepository()

    /**
     * get decrypted mobile phone number.
     * @param {String} deviceMobileNumber 
     * @returns {String}
     */
    function executeGetDecryptedPhoneNumberUseCase(deviceMobileNumber) {
        if (hasValidPhoneNumber(deviceMobileNumber)) {
            logDebug(LOG_TAG, "<<< phone number is NOT encrypted and already valid")
            return deviceMobileNumber
        }
        return decryptDeviceMobileNumber(deviceMobileNumber)
    }

    return {
        executeGetDecryptedPhoneNumberUseCase
    }
}

export default GetDecryptedPhoneNumberUseCase