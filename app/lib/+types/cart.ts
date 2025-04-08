import type Item from "~/lib/+types/item";
import type ItemType from "~/lib/+types/item-type";

import { z } from "zod";

export default class Cart {
	// READONLY field `items` is a Map of
	readonly items: Map<string, CartItemFamily> = new Map();
	private validTypes: ItemType[];
	totalItems: number = 0;
	totalPrice: number = 0;

	constructor(itemFamilies: CartItemFamily[], itemTypes: ItemType[]) {
		for (let i = 0; i < itemFamilies.length; i++) {
			// Set items
			this.items.set(itemFamilies[i].type.id, itemFamilies[i]);

			// Set totalItems and totalPrice
			for (let j = 0; j < itemFamilies[i].children.length; j++) {
				this.totalItems += itemFamilies[i].children[j].count;
				this.totalPrice +=
					itemFamilies[i].children[j].item.totalPrice *
					itemFamilies[i].children[j].count;
			}
		}
		// Set valid types
		this.validTypes = itemTypes;
	}

	/**
	 * Adds an item to the cart.
	 * @param item - The item to add.
	 * @param count - The number of that item to add.
	 */
	addCartItem = (item: Item, count: number) => {
		if (count <= 0) return;
		const itemFamily = this.items.get(item.typeId);

		if (itemFamily) {
			// Update item family
			const cartItem = itemFamily.children.find(
				(i) => i.item.selectKey === item.selectKey,
			);

			if (cartItem) cartItem.count += count;
			else
				itemFamily.children.push({
					item: item,
					count: count,
				});

			this.totalItems += count;
			this.totalPrice += count * item.totalPrice;
		} else {
			const type = this.validTypes.find((type) => type.id === item.typeId);

			if (type)
				this.items.set(item.typeId, {
					type: type,
					children: [{ item, count }],
				});
			else
				console.warn(
					"Attempted to add an item to the cart with a type that does not exist.",
				);
		}
	};

	/**
	 * Removes the given item from the cart count number of times.
	 * @param item - The item to remove.
	 * @param count - The number of that item to remove.
	 */
	removeCartItem = (item: Item, count: number) => {
		const itemFamily = this.items.get(item.typeId);

		if (itemFamily) {
			const cartItemIndex = itemFamily.children.findIndex(
				(i) => i.item.selectKey === item.selectKey,
			);

			if (cartItemIndex < 0) return;

			// Adjust count
			itemFamily.children[cartItemIndex].count -= count;

			// If count is now 0, remove item from the cart entirely.
			if (itemFamily.children[cartItemIndex].count <= 0) {
				itemFamily.children.splice(cartItemIndex, 1);
			}

			this.totalItems -= count;
			this.totalPrice -= count * item.totalPrice;
		}
	};

	/**
	 * Gets the CartItemFamily for a given type id.
	 * @param typeId - The id to search for.
	 */
	getCartItemFamily = (typeId: string) => {
		return this.items.get(typeId);
	};

	/**
	 * Gets a CartItem for a given item.
	 * @param item - The item to search for.
	 */
	getCartItem = (item: Item) => {
		return this.items
			.get(item.typeId)
			?.children.find((i) => i.item.selectKey === item.selectKey);
	};

	toString = () => {
		return JSON.stringify(this.items.values());
	};
}

export interface CartItem {
	item: Item;
	count: number;
}

export interface CartItemFamily {
	type: ItemType;
	children: CartItem[];
}

const zCart = z.array(
	z.object({
		type: z.object({
			id: z.string(),
			name: z.string(),
			imgUrl: z.string().optional(),
			desc: z.string(),
			basePrice: z.number(),
			options: z.array(
				z.object({
					optName: z.string(),
					type: z.number(),
					abrv: z.string().optional(),
					optSet: z.array(
						z.object({
							label: z.string(),
							priceAdj: z.number(),
							isDefault: z.boolean(),
						}),
					),
				}),
			),
		}),
		children: z.array(
			z.object({
				item: z.object({
					typeId: z.string(),
					selectKey: z.string(),
					totalPrice: z.number(),
				}),
				count: z.number(),
			}),
		),
	}),
);

export function isCart(data: object) {
	return zCart.parse(data);
}
