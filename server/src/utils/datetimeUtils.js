const triggerValidations = {
    "every_day_at": {
        "target_hour": validateHour,
        "target_minute": validateMinute
    },
    "every_hour_at": {
        "target_minute": validateEveryHourAtMinute
    },
    "every_day_of_the_week_at": {
        "days_array": formatAndValidateDaysArray,
        "target_hour": validateHour,
        "target_minute": validateMinute
    },
    "every_month_on_the": {
        "target_day": validateDay,
        "target_hour": validateHour,
        "target_minute": validateMinute
    },
    "every_year_on": {
        "target_month": validateMonth,
        "target_day": validateDay,
        "target_hour": validateHour,
        "target_minute": validateMinute
    }
}

const VALID_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function validateHour(hour) {
    const parsedHour = parseInt(hour, 10);
    return !isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23;
}

function validateMinute(minute) {
    const parsedMinute = parseInt(minute, 10);
    return !isNaN(parsedMinute) && parsedMinute >= 0 && parsedMinute <= 59;
}

function validateDay(day) {
    const parsedDay = parseInt(day, 10);
    return !isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31;
}

function validateMonth(month) {
    const parsedMonth = parseInt(month, 10);
    return !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12;
}

function validateEveryHourAtMinute(minute) {
    const intMinute = parseInt(minute, 10);
    return !isNaN(intMinute) && [0, 15, 30, 45].includes(intMinute);
}

function formatAndValidateDaysArray(input) {
    const days = input.split(/[\s,]+/).filter(Boolean).map(day => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase());
    for (const day of days) {
        if (!VALID_DAYS.includes(day)) {
            return null;
        }
    }
    return days.join(' ');
}

function checkDatetimeParameters(triggerType, parameters) {
    const validations = triggerValidations[triggerType];
    if (!validations) {
        throw new Error(`Unrecognized trigger type: ${triggerType}. Make sure you are passing the correct trigger name/type.`);
    }
    for (let param of parameters) {
        const validate = validations[param.name];
        if (!validate) {
            throw new Error(`Validation for parameter ${param.name} not found.`);
        }
        if (param.name === "days_array") {
            const formattedDays = formatAndValidateDaysArray(param.input);
            if (formattedDays === null) {
                throw new Error(`Invalid ${param.name} provided`);
            } else {
                param.input = formattedDays;
            }
        } else if (!validate(param.input)) {
            throw new Error(`Invalid ${param.name} provided`);
        }
    }
    return true;
}
module.exports = {
    checkDatetimeParameters,
};
