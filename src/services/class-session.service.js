import { handleResponse, HEADERS, URL_TIME_SLOTS, URL_CLASS_SESSION, API_URL } from "./service";

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
        await new Promise(r=>setTimeout(r, 1000))
        const response = await fetch(url, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    },
    getClassrooms: async () => {
        const response = await fetch(`${API_URL}/classrooms`, {
            method: "GET",
            headers: HEADERS
        })
        return handleResponse(response)
    }
}