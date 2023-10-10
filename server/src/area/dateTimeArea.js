function everyDayAt(targetHour, targetMinute) {
    const now = new Date();
    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        return true;
    }
    return false;
}

function everyHourAt(targetMinute) {
    const validMinutes = [0, 15, 30, 45];
    const now = new Date();
    if (validMinutes.includes(targetMinute) && now.getMinutes() === targetMinute) {
        return true;
    }
    return false;
}

function everyDayOfTheWeekAt(daysArray, targetHour, targetMinute) {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    if (
        daysArray.includes(currentDay) &&
        now.getHours() === targetHour &&
        now.getMinutes() === targetMinute
    ) {
        return true;
    }
    return false;
}

function everyMonthOnThe(targetDay, targetHour, targetMinute) {
    const now = new Date();
    if (
        now.getDate() === targetDay &&
        now.getHours() === targetHour &&
        now.getMinutes() === targetMinute
    ) {
        return true;
    }
    return false;
}

function everyYearOn(targetMonth, targetDay, targetHour, targetMinute) {
    const now = new Date();
    if (
        now.getMonth() + 1 === targetMonth &&
        now.getDate() === targetDay &&
        now.getHours() === targetHour &&
        now.getMinutes() === targetMinute
    ) {
        return true;
    }
    return false;
}

module.exports = {
    everyDayAt,
    everyHourAt,
    everyDayOfTheWeekAt,
    everyMonthOnThe,
    everyYearOn,
};
