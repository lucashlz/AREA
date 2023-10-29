const moment = require("moment-timezone");

function getCurrentTimeInZone() {
    const parisTime = moment().tz("Europe/Paris");
    parisTime.add(1, "hours");
    return parisTime;
}

function findParameter(parameters, name) {
    const parameter = parameters.find((p) => p.name === name);
    return parameter ? parseInt(parameter.input, 10) : null;
}

async function processTriggerData(areaEntry, key, value) {
    if (areaEntry.trigger.data && areaEntry.trigger.data.value === value) {
        return false;
    }
    areaEntry.trigger.data = { key, value };
    await areaEntry.save();
    return true;
}

async function resetTriggerDataIfNecessary(areaEntry) {
    if (areaEntry.trigger.data) {
        areaEntry.trigger.data = null;
        await areaEntry.save();
    }
}

function updateOrPushIngredient(ingredients, ingredient) {
    const index = ingredients.findIndex((item) => item.name === ingredient.name);
    if (index !== -1) {
        ingredients[index].value = ingredient.value;
    } else {
        ingredients.push(ingredient);
    }
}

function fillDateTimeIngredients(now) {
    return [
        { name: "date", value: now.format("YYYY-MM-DD") },
        { name: "day", value: now.format("dddd") },
        { name: "month", value: now.format("M") },
        { name: "year", value: now.format("YYYY") },
        { name: "hour", value: now.format("H") },
        { name: "minute", value: now.format("m") },
    ];
}

async function everyDayAt(areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${targetHour}-${targetMinute}`;
    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        const ingredients = fillDateTimeIngredients(getCurrentTimeInZone());
        ingredients.forEach((ingredient) => updateOrPushIngredient(areaEntry.trigger.ingredients, ingredient));
        return await processTriggerData(areaEntry, "lastTriggered", uniqueIdentifier);
    }
    return false;
}

async function everyHourAt(areaEntry) {
    const validMinutes = [0, 15, 30, 45];
    const now = getCurrentTimeInZone().toDate();
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${targetMinute}`;
    if (validMinutes.includes(targetMinute) && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        const ingredients = fillDateTimeIngredients(getCurrentTimeInZone());
        ingredients.forEach((ingredient) => updateOrPushIngredient(areaEntry.trigger.ingredients, ingredient));
        return await processTriggerData(areaEntry, "lastTriggered", uniqueIdentifier);
    }
    return false;
}

async function everyDayOfTheWeekAt(areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${currentDay}-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${targetHour}-${targetMinute}`;
    const daysArray = areaEntry.trigger.parameters.filter((p) => p.name === "days_array").flatMap((p) => p.input.split(/\s+/));
    if (daysArray.includes(currentDay) && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        const ingredients = fillDateTimeIngredients(getCurrentTimeInZone());
        ingredients.forEach((ingredient) => updateOrPushIngredient(areaEntry.trigger.ingredients, ingredient));
        return await processTriggerData(areaEntry, "lastTriggered", uniqueIdentifier);
    }
    return false;
}

async function everyMonthOnThe(areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${targetDay}-${targetHour}-${targetMinute}`;
    if (now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        const ingredients = fillDateTimeIngredients(getCurrentTimeInZone());
        ingredients.forEach((ingredient) => updateOrPushIngredient(areaEntry.trigger.ingredients, ingredient));
        return await processTriggerData(areaEntry, "lastTriggered", uniqueIdentifier);
    }
    return false;
}

async function everyYearOn(areaEntry) {
    const now = getCurrentTimeInZone().toDate();
    const targetMonth = findParameter(areaEntry.trigger.parameters, "target_month");
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${targetMonth}-${targetDay}-${targetHour}-${targetMinute}`;
    if (now.getMonth() + 1 === targetMonth && now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        const ingredients = fillDateTimeIngredients(getCurrentTimeInZone());
        ingredients.forEach((ingredient) => updateOrPushIngredient(areaEntry.trigger.ingredients, ingredient));
        return await processTriggerData(areaEntry, "lastTriggered", uniqueIdentifier);
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
