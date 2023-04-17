export class Logger {

    public static infoLog(message: string) {
        console.log('[INFO]: ' + message);
    }

    public static errorLog(message: string) {
        console.log('[ERROR]: ' + message);
    }

    public static debugLog(message: string) {
        console.log('[DEBUG]: ' + message);
    }

    public static warnLog(message: string) {
        console.log('[WARN]: ' + message);
    }

    public static fatalLog(message: string) {
        console.log('[FATAL]: ' + message);
    }

    public static traceLog(message: string) {
        console.log('[TRACE]: ' + message);
    }

    public static log(message: string) {
        console.log(message);
    }
}

export default {Logger};