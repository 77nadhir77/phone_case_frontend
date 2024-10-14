//bg-blue-950 border-blue-950
//bg-zinc-900 border-zinc-900
//bg-rose-950 border-rose-950

//border-primary

import { PRODUCT_PRICES } from "../config/products"

export const COLORS = [
    {label: "Black", value: "black", hex:"#18181b", tw: "zinc-900"},
    {label: "Blue", value: "blue", hex: "#172554", tw: "blue-950"},
    {label: "Rose", value: "rose", hex: "#4c0519", tw: "rose-950"},
] as const



export const MODELS = {
    name: "models",
    options: [
        {label: "IPhone X", value: "iphonex"},
        {label: "IPhone 11", value: "iphone11"},
        {label: "IPhone 12", value: "iphone12"},
        {label: "IPhone 13", value: "iphone13"},
        {label: "IPhone 14", value: "iphone14"},
        {label: "IPhone 15", value: "iphone15"},
    ]
} as const


export const MATERIALS = {
    name: "materials",
    options: [
        {
            label: "Silicone",
            value: "Silicone",
            description: undefined,
            price: PRODUCT_PRICES.material.selecone
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate",
            description: "Scratch-resistence coating",
            price: PRODUCT_PRICES.material.polycarbonate
        },
    ]
} as const


export const FINISHES = {
    name: "finishes",
    options: [
        {
            label: "Smooth Finish",
            value: "smooth",
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: "Textured Finish",
            value: "textured",
            description: "Soft grippy texture",
            price: PRODUCT_PRICES.finish.textured
        },
    ]
} as const