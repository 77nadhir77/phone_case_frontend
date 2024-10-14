export const priceFormater = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
});

export const PRODUCT_PRICES = {
	material: {
		selecone: 0,
		polycarbonate: 5_00,
	},
	finish: {
		smooth: 0,
		textured: 3_00,
	},
} as const;

export const BASE_PRICE = 14_00;
