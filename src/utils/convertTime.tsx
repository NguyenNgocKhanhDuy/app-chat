export default function convertTime(dateString : string) {
    const originalTime = new Date(dateString+'Z'); // Thời gian ở múi giờ UTC+0
    const timezoneOffset = 7; // UTC+7
    const convertedTime = new Date(originalTime.getTime() + timezoneOffset * 60 * 60 * 1000);

    const formattedTime = convertedTime.toISOString().replace('T', ' ').substr(0, 19); // Định dạng lại thời gian


    return formattedTime;
}


export function getHourMinute(timeString: string) {
    const time = timeString.substring(11, timeString.length)
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];

    return `${hour}:${minute}`;
}