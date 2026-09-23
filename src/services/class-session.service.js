import { handleResponse, HEADERS, URL_TIME_SLOTS, URL_CLASS_SESSION } from "./service";

export const classSessionsService = {
    getTimeSlots: async () => {
        const response = await fetch(URL_TIME_SLOTS, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    },
    getAll: async (filters = {}) => {
        const url = new URL(URL_CLASS_SESSION)
        url.search = new URLSearchParams(filters).toString()
        const response = await fetch(url, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    },
}