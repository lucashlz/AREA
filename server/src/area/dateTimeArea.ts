import moment from "moment-timezone";
import { updateIngredients } from "../utils/ingredients/ingredientsHelper";
import { processTrigger } from "../utils/area/areaValidation";

const getCurrentTimeInZone = (): Date => moment().tz("Europe/Paris").add(1, "hours");

const findParameter = (parameters: { name: string; input: string }[], name: string): number | null => {
    const parameter = parameters.find((p) => p.name === name);
    return parameter ? parseInt(parameter.input, 10) : null;
};

interface Ingredient {
    name: string;
    value: string;
}

const fillDateTimeIngredients = (date: Date): Ingredient[] => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[date.getDay()];
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return [
        { name: "date", value: `${year}-${month}-${day}` },
        { name: "day", value: dayOfWeek },
        { name: "month", value: month },
        { name: "year", value: year },
        { name: "hour", value: hour },
        { name: "minute", value: minute },
    ];
};

interface TriggerData {
    value: string;
}

interface AreaEntry {
    trigger: {
        data?: TriggerData;
        parameters: { name: string; input: string }[];
    };
}

export const everyDayAt = async (areaEntry: AreaEntry): Promise<boolean> => {
    const now = getCurrentTimeInZone();
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${targetHour}-${targetMinute}`;

    if (targetHour !== null && targetMinute !== null) {
        const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${targetHour}-${targetMinute}`;

    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            await updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredDay", uniqueIdentifier);
        }
    }
    return false;
};

export const everyHourAt = async (areaEntry: AreaEntry): Promise<boolean> => {
    const validMinutes = [0, 15, 30, 45];
    const now = getCurrentTimeInZone();
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`;

    if (validMinutes.includes(targetMinute) && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredHour", uniqueIdentifier);
        }
    }
    return false;
};

export const everyDayOfTheWeekAt = async (areaEntry: AreaEntry): Promise<boolean> => {
    const now = getCurrentTimeInZone();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${currentDay}-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const daysArray = areaEntry.trigger.parameters.filter((p) => p.name === "days_array").flatMap((p) => p.input.split(/\s+/));

    if (daysArray.includes(currentDay) && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredDayOfWeek", uniqueIdentifier);
        }
    }
    return false;
};

export const everyMonthOnThe = async (areaEntry: AreaEntry): Promise<boolean> => {
    const now = getCurrentTimeInZone();
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${now.getMonth() + 1}-${targetDay}`;

    if (now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredMonth", uniqueIdentifier);
        }
    }
    return false;
};

export const everyYearOn = async (areaEntry: AreaEntry): Promise<boolean> => {
    const now = getCurrentTimeInZone();
    const targetMonth = findParameter(areaEntry.trigger.parameters, "target_month");
    const targetDay = findParameter(areaEntry.trigger.parameters, "target_day");
    const targetHour = findParameter(areaEntry.trigger.parameters, "target_hour");
    const targetMinute = findParameter(areaEntry.trigger.parameters, "target_minute");
    const uniqueIdentifier = `${now.getFullYear()}-${targetMonth}-${targetDay}`;

    if (now.getMonth() + 1 === targetMonth && now.getDate() === targetDay && now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        if (!areaEntry.trigger.data || areaEntry.trigger.data.value !== uniqueIdentifier) {
            updateIngredients(areaEntry, fillDateTimeIngredients(now));
            return await processTrigger(areaEntry, "lastTriggeredYear", uniqueIdentifier);
        }
    }
    return false;
};

const getCurrentTimeInZone = (): Date => moment().tz("Europe/Paris").add(1, "hours");