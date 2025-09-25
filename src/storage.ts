import type { Field, Sample } from "./types";

const KEY = "sample_manager_v1";

export interface Persist {
    samples: Sample[];
    fields: Field[];
}

const defaultData: Persist = {
    samples: [
        { id: "s-a", name: "a" },
        { id: "s-b", name: "b" },
        { id: "s-c", name: "c" },
        { id: "s-d", name: "d" },
        { id: "s-e", name: "e" },
        { id: "s-f", name: "f" }
    ],
    fields: [
        {
            id: "f-1",
            label: "가",
            type: "select",
            visible: true,
            options: [
                { id: "o-1-1", index: 1, value: "옵션1" },
                { id: "o-1-2", index: 2, value: "옵션2" },
                { id: "o-1-3", index: 3, value: "옵션3" }
            ]
        },
        {
            id: "f-2",
            label: "나",
            type: "text",
            visible: true,
            options: []
        },
        {
            id: "f-3",
            label: "다",
            type: "checkbox",
            visible: true,
            options: [
                { id: "o-3-1", index: 1, value: "옵션1" },
                { id: "o-3-2", index: 2, value: "옵션2" }
            ]
        }
    ]
};

export function loadPersist(): Persist {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) {
            localStorage.setItem(KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(raw) as Persist;
    } catch (e) {
        console.error("loadPersist error", e);
        return defaultData;
    }
}

export function savePersist(payload: Persist) {
    try {
        localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (e) {
        console.error("savePersist error", e);
    }
}
