import { Type as t, type Static } from "@sinclair/typebox";
import { Nullable } from "~/utils/types/nullable";
import { uuidObj, type UUID } from "~/utils/types/uuid";
import {
	itemOnMenuTObj,
	itemSelectTObj,
	itemTObj,
	type Item,
} from "./menu.validation";
import { useEffect, useState } from "react";
import { Value } from "@sinclair/typebox/value";

// Represents an item that has been customized by the user
const LineItemObj = t.Object({
	parentItemId: Nullable(t.Union([t.Integer(), t.String()])),
	count: t.Integer(),
	selections: t.Array(itemSelectTObj),
	notes: t.Optional(Nullable(t.String())),
});
export type TLineItem = Static<typeof LineItemObj>;

// Represents the parent item containing a list of line items, identified by its
const CartItemObj = t.Object({
	// Under an items id, it may have variants with customizations from the user
	totalCount: t.Integer(),
	details: itemTObj,
	lineItems: t.Record(uuidObj, LineItemObj),
});
export type TCartItem = Static<typeof CartItemObj>;

// Represents the Cart class structure in object form
const CartObj = t.Object({
	items: t.Record(t.String(), CartItemObj),
	sessId: t.String({ format: "uuid" }),
});
export type TCart = Static<typeof CartObj>;
export type UnfoldedCart = Array<
	{ id: ItemId; lineItems: Array<{ id: UUID } & TLineItem> } & Omit<
		TCartItem,
		"lineItems"
	>
>;

// Represents the possible typings for an item's id
export type ItemId = number | string;

/**
 * Represents a user's cart.
 * @param init - The items to initiate the cart with.
 * @returns
 */
export default function useCartModel(
	init: Partial<TCart> & Omit<TCart, "items">,
) {
	// PROPERTIES
	// Key used for saving and retrieving cart from session storage
	const STORAGE_KEY = `cart:${init.sessId}`;

	// Item groupings of line items and their details by their item id
	const [itemGroups, setItemGroups] = useState<
		Record<ItemId, { details: Item; lineItems: UUID[] }> | undefined
	>(undefined);
	// Line item details by their uuids, related to their parent items
	const [lineItems, setLineItems] = useState<
		Record<UUID, TLineItem> | undefined
	>(undefined);

	// Items stored in the cart
	// const [items, setItems] = useState<Record<ItemId, TCartItem> | undefined>(
	// 	init?.items,
	// );

	// HOOKS
	// Attempt to update cart once DOM has loaded
	useEffect(() => {
		updateFromStorage();
	}, []);

	// Save cart any time the items list is updated
	useEffect(() => {
		if (Value.Check(t.Omit(CartObj, ["sessId"]), toObject())) {
			const timeout = setTimeout(() => {
				saveToStorage();
			}, 200); // Small delay to ensure state is settled

			return () => clearTimeout(timeout);
		}
	}, [lineItems, parentItems]);

	// PRIVATE FUNCTIONS
	/**
	 * Sets a single item in the items state.
	 * @param itemId - The id of the item to set.
	 * @param setItem - A function whose only argument is the item object being update,
	 * and which returns the item object to set it to.
	 */
	const setItem = (
		itemId: ItemId,
		setItem:
			| ((item: TCartItem | undefined) => Partial<TCartItem>)
			| Partial<TCartItem>,
	) => {
		return setItems({
			...items,

			// Set item to return of function
			// Allows user to change parts of the item based on the item's values
			// Returns only need to be partial, meaning an item can also be updated this way
			[itemId]: {
				...items[itemId],
				...(typeof setItem === "function"
					? setItem(items ? items[itemId] : undefined)
					: setItem),
			},
		});
	};

	// Handles item category manipulation
	const setLineItem = (
		parentItem: Item,
		liId: UUID,
		setFunc: ((prev: TLineItem | undefined) => TLineItem) | TLineItem,
	) => {
		// Get previous line item from line items if defined
		const prevLI = lineItems && lineItems[liId];

		// Get previous line item group
		let prevGroup = undefined;
		if (prevLI && prevLI.parentItemId !== null && itemGroups)
			prevGroup = itemGroups[prevLI.parentItemId];

		// Get new line item from callback function or data
		const newLI = typeof setFunc === "function" ? setFunc(prevLI) : setFunc;

		// Get new line item group
		let newGroup = undefined;
		if (newLI.parentItemId !== null && itemGroups)
			newGroup = itemGroups[newLI.parentItemId];
	};

	// EXPORTED FUNCTIONS
	// # General methods

	const getCartPrice = () => {
		let totalPrice = 0;

		for (const iKey in items) {
			// For every item in the cart
			const item = items[iKey];

			for (const liKey in item.lineItems) {
				// For every variant of that item, create a grand sum for the total cost of all items
				const lineItem = item.lineItems[liKey];

				// Sum all selections on the line item and add it to the item base price
				const liPrice =
					item.details.basePrice +
					lineItem.selections.reduce((a, s) => a + s.price, 0);

				// Multiply by the count of the line item and add it to the total price
				totalPrice += liPrice * lineItem.count;
			}
		}

		return totalPrice / 100;
	};
	// # Line Item methods
	/**
	 * Gets the total number of items (including the number of variants) of each item in the Cart.
	 * @returns an integer representing the total number of items in the cart.
	 */
	const getNumLineItems = () => {
		let total = 0;
		// Currently the line item itself is the number of items
		for (const key in items) {
			total += items[key].totalCount;
		}
		return total;
	};

	/**
	 * Gets all line items currently in the cart.
	 * @returns - An array of line items including their id and their parentId
	 */
	const getLineItems = (): Array<
		TLineItem & { parentId: number; id: string }
	> => {
		const lineItems: (TLineItem & { parentId: number; id: string })[] = [];

		for (const key in items) {
			// Map each item's line items into a more detailed set of objects
			const detailedLIs = Object.entries(items[key].lineItems).map(
				([liKey, li]) => ({ parentId: Number(key), id: liKey, ...li }),
			);

			// Push line items to full array
			lineItems.push(...detailedLIs);
		}

		return lineItems;
	};

	/**
	 * Creates a new line item under the given item id.
	 * @param itemId the item id to create the line item under.
	 * @param lineItem the line item to create.
	 */
	const createLineItem = (item: Item, lineItem: TLineItem) => {
		const newUUID = crypto.randomUUID();

		setItem(item.id, (i) => ({
			// Update item count
			totalCount: (i?.totalCount ?? 0) + lineItem.count,
			lineItems: {
				...i?.lineItems,

				// Add new line item
				[newUUID]: lineItem,
			},
			details: item,
		}));
	};

	/**
	 * Removes a given line item.
	 * @param itemId the item id the line item is under.
	 * @param lineItemId the uuid of the line item.
	 */
	const removeLineItem = (itemId: ItemId, lineItemId: UUID) => {
		if (!items) return;

		const cartItem = items[itemId];
		const lineItem = cartItem.lineItems[lineItemId];

		const reducedLineItems = Object.fromEntries(
			Object.entries(cartItem.lineItems).filter(([key]) => key !== lineItemId),
		);

		setItem(itemId, {
			totalCount: cartItem.totalCount - lineItem.count,
			lineItems: {
				...reducedLineItems,
			},
		});
	};

	/**
	 * Updates an existing line item.
	 * @param itemId the item id of the line item parent.
	 * @param lineItemId the uuid of the line item.
	 * @param changes an object containing all fields to update in the line item.
	 */
	const updateLineItem = (
		itemId: ItemId,
		lineItemId: UUID,
		changes: Partial<TLineItem>,
	) => {
		if (!items) return;

		// Get values from current state object
		const cartItem = items[itemId];
		const lineItem = cartItem.lineItems[lineItemId];
		const prevCount = lineItem.count; // Saved for later in function

		// Create updated line item
		const updatedLineItem = {
			...lineItem,
			...changes,
		};

		// Create updated cart item total
		const countDiff = prevCount - cartItem.lineItems[lineItemId].count;
		const updatedCount = countDiff + cartItem.totalCount;

		// Set state to new values
		setItem(itemId, (i) => ({
			totalCount: updatedCount,
			lineItems: {
				...i?.lineItems,
				[lineItemId]: updatedLineItem,
			},
		}));
	};

	/**
	 * Removes any items from the cart that are not passed in the list of valid items.
	 * @param validItems an array containing item objects to check the cart against
	 * @returns this Cart.
	 */
	const validateEntries = (validItems: Item[]) => {
		if (!items) return;

		const verifiedItems: Record<ItemId, TCartItem> = {};

		for (const v of validItems) {
			if (items[v.id]) {
				verifiedItems[v.id] = items[v.id];
			}
		}

		setItems(verifiedItems);
	};

	/**
	 * Returns an array of items with their ids, counts, and differentiated by their selections.
	 */
	const toUnfoldedArray = (): UnfoldedCart => {
		const arr: UnfoldedCart = [];

		// Map every cart item to new object
		for (const key in items) {
			const item: any = items[key];

			// Add id to item object
			item.id = key;

			// Unwrap lineItems into array
			item.lineItems = Object.keys(item.lineItems).map((k) => ({
				id: k,
				...item.lineItems[k],
			}));

			// Add new item to array
			arr.push(item);
		}

		return arr;
	};

	/**
	 * @returns - The cart as an object
	 */
	const toObject = () => {
		return { items };
	};

	/**
	 * Updates the cart according to what has been saved to storage.
	 */
	const updateFromStorage = () => {
		const cartData = sessionStorage.getItem(STORAGE_KEY);

		// Parse empty string if data is null; "" will fail isCart test
		const parsedData = JSON.parse(cartData ?? "{}");

		const [...errors] = Value.Errors(t.Omit(CartObj, ["sessId"]), parsedData);
		// If data is cart, update cart to reflect read data
		if (errors.length === 0 && parsedData.items) {
			console.log("Loaded data for cart", parsedData);
			setItems(parsedData.items);
		} else {
			console.error("Loaded data is not a valid cart", errors);
		}
	};

	/**
	 * Saves the cart to local storage.
	 */
	const saveToStorage = () => {
		const cartData = JSON.stringify(toObject());

		console.log("Autosaving cart data", toObject());

		sessionStorage.setItem(STORAGE_KEY, cartData);
	};

	// Freeze the object before passing it as an export
	return Object.freeze({
		items,

		getCartPrice,

		getNumLineItems,
		getLineItems,
		createLineItem,
		removeLineItem,
		updateLineItem,

		validateEntries,
		toUnfoldedArray,
		toObject,

		updateFromStorage,
		saveToStorage,
	});
}
