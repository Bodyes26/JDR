export function todayReadableOnlyDate() {
    let ret = new Date();
    let temp = "";
    if (ret.getDate() < 10) {
        temp = temp + "0";
    }
    temp = temp + ret.getDate() + "/";
    if (ret.getMonth() + 1 < 10) {
        temp = temp + "0";
    }
    let tempMonth = ret.getMonth() + 1;
    temp = temp + tempMonth + "/" + ret.getFullYear();
    return temp;
}

export function todayReadableFullDate() {
    let ret = new Date();
    let temp = todayReadableOnlyDate();
    temp = temp + " ";
    if (ret.getHours() < 10) {
        temp = temp + "0";
    } temp = temp + ret.getHours() + ":";
    if (ret.getMinutes() < 10) {
        temp = temp + "0";
    }
    temp = temp + ret.getMinutes();
    return temp;
}

/**
 * @param {string} day
 */
export function dateForPocketbase(day) {
    let ret;
    if (day == "today") {
        const today = new Date();
        ret = today.getFullYear() + "-";
        if (today.getMonth() < 10) {
            ret = ret + "0";
        }
        ret = ret + (today.getMonth() + 1) + "-";
        if (today.getDate() < 10) {
            ret = ret + "0";
        }
        ret = ret + today.getDate();
    } else if (day == "tomorrow") {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        ret = tomorrow.getFullYear() + "-";
        if (tomorrow.getMonth() < 10) {
            ret = ret + "0";
        }
        ret = ret + (tomorrow.getMonth() + 1) + "-";
        if (tomorrow.getDate() < 10) {
            ret = ret + "0";
        }
        ret = ret + tomorrow.getDate();
    }
    else if (day == "afterTomorrow") {
        const today = new Date();
        const afterTomorrow = new Date();
        afterTomorrow.setDate(today.getDate() + 2);
        ret = afterTomorrow.getFullYear() + "-";
        if (afterTomorrow.getMonth() < 10) {
            ret = ret + "0";
        }
        ret = ret + (afterTomorrow.getMonth() + 1) + "-";
        if (afterTomorrow.getDate() < 10) {
            ret = ret + "0";
        }
        ret = ret + afterTomorrow.getDate();
    }
    return ret;
}

/**
 * @param {string} dateTime
 */
export function setupDateTimeForPocketbase(dateTime) {
    console.log(dateTime);
    let ret;
    if (dateTime.substring(10, 11) == ",") {
        ret =
            dateTime.substring(6, 10) +
            "-" +
            dateTime.substring(3, 5) +
            "-" +
            dateTime.substring(0, 2) +
            " " +
            dateTime.substring(12, 17) +
            ":00";
    } else {
        ret =
            dateTime.substring(6, 10) +
            "-" +
            dateTime.substring(3, 5) +
            "-" +
            dateTime.substring(0, 2) +
            " " +
            dateTime.substring(11, 16) +
            ":00";
    }
    return ret;
}

/**
 * @param {string} datetime
 */
export function readableDateTime(datetime) {
    let ret;
    ret =
        datetime.substring(8, 10) +
        "/" +
        datetime.substring(5, 7) +
        "/" +
        datetime.substring(0, 4) +
        ", " +
        datetime.substring(11, 16);
    return ret;
}