import {Page} from "../types/Page.ts";
import {RbEvent} from "../types/RbEvent.ts";

const protocol = import.meta.env.VITE_API_PROTOCOL;
const hostname = import.meta.env.VITE_API_HOSTNAME;
const port = import.meta.env.VITE_API_PORT;
const pathname = import.meta.env.VITE_API_PATHNAME;
const baseUrl = `${protocol}://${hostname}:${port}/${pathname}`;

export const getPages = async (): Promise<Page[]> => {
    const url = baseUrl + 'pages';

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });

        return await response.json() as Page[];
    } catch (e) {
        return [];
    }
}

export const getPage = async (id: number): Promise<Page | null> => {
    const url = baseUrl + 'pages/' + id;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });

        return await response.json() as Page;
    } catch (e) {
        return null;
    }
}

export const createPage = async (data): Promise<boolean> => {
    const url = baseUrl + 'pages';
    const {title, content} = data;

    const body = {title, content};

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log('create Page res: ', response)
        return true;
    } catch (e) {
        return false;
    }
}

export const savePage = async (id: number, data): Promise<boolean> => {
    const url = baseUrl + 'pages/' + id;
    const {title, content} = data;

    const body = {title, content};

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log('save Page res: ', response)
        return true;
    } catch (e) {
        return false;
    }
}

export const deletePage = async (id: number): Promise<boolean> => {
    const url = baseUrl + 'pages/' + id;

    try {
        const response = await fetch(url, {
            method: "DELETE"
        });

        console.log('delete Page res: ', response)
        return true;
    } catch (e) {
        return false;
    }
}

export const getEvents = async (): Promise<RbEvent[]> => {
    const url = baseUrl + 'events';

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });

        return await response.json() as RbEvent[];
    } catch (e) {
        return [];
    }
}

export const deleteEvent = async (id: number): Promise<boolean> => {
    const url = baseUrl + 'events/' + id;

    try {
        const response = await fetch(url, {
            method: "DELETE"
        });

        console.log('delete Event res: ', response)
        return true;
    } catch (e) {
        return false;
    }
}