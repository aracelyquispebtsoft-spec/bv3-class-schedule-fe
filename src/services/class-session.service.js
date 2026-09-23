import { handleResponse, HEADERS, URL_TIME_SLOTS, URL_CLASS_SESSION } from "./service";

export const classSessionsService = {
    getTimeSlots: async () => {
        const response = await fetch(URL_TIME_SLOTS, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    },
    getAll: async () => {
        const response = await fetch(URL_CLASS_SESSION, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    }
}