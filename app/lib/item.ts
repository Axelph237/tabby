import { z } from "zod";

export default class ItemType {
	// READONLY member `id` is the UUID of the item type.
	readonly id: string;
	// READONLY member `name` represents the name of the ItemType.
	readonly name: string;
	// READONLY member `imgUrl` is the source of an image representing the ItemType.
	readonly imgUrl: string | undefined;
	// READONLY member `description` represents a description of the ItemType.
	readonly description: string;
	// READONLY member `basePrice` is the minimum price of this object before selection modifiers are considered.
	readonly basePrice: number;
	// READONLY member `options` contains a Map linking option objects with string keys.
	readonly options = new Map<string, ItemTypeOption>();

	constructor(
		id: string,
		name: string,
		description: string,
		basePrice?: number,
		imgUrl?: string,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.basePrice = basePrice ?? 0;
		this.imgUrl = imgUrl;
	}

	/**
	 * Creates a new option with object interface `ItemTypeOption` using `type`, and `args`. The option has a key reference as `optName`.
	 * @param opts - The option to add, following the ItemTypeOption interface.
	 */
	newOption = (opts: ItemTypeOption) => {
		const validTypes = ["one", "many", "text"];

		// ERROR CHECKING
		// Valid type
		if (!validTypes.includes(opts.type)) {
			throw Error(
				`Failed to create item option \"${opts.optName}\" on item \"${this.name}\": Type ${opts.type} is not a valid type.`,
			);
		}
		// Has args if required
		if (
			(opts.type === "one" || opts.type === "many") &&
			(!opts.args || opts.args.length === 0)
		) {
			throw Error(
				`Failed to create item option \"${opts.optName}\" on item \"${this.name}\": Args cannot be undefined or empty for type \"${opts.type}\".`,
			);
		}

		this.options.set(opts.optName, opts);
	};

	/**
	 * Removes the given option from the options list.
	 * @param optName - The name of the option to remove
	 */
	removeOption = (optName: string) => {
		this.options.delete(optName);
	};

	/**
	 * Creates and returns a new item given a list of option selections.
	 * @param selections - The values of any options the ItemType has, including defaults.
	 * @return item - The item object following the Item interface.
	 */
	createItem = (selections: ItemTypeSelection[]) => {
		let item: Item = {
			name: this.name,
			description: this.description,
			imgUrl: this.imgUrl,
			id: this.id,
			selections: [],
			totalPrice: this.basePrice,
		};

		for (let i = 0; i < selections.length; i++) {
			const option = this.options.get(selections[i].optName);

			// Skip option if undefined
			if (!option) continue;

			// Add selection to item
			item.selections?.push(selections[i]);
			// Change item price based on selection
			if (
				option?.type === "one" &&
				typeof selections[i].value === "string" &&
				option.args
			) {
				// Search option args for first selection
				for (let i = 0; i < option.args.length; i++) {
					// If option found, add price to item price and break
					if (option.args[i].name === selections[i].value) {
						item.totalPrice += option.args[i].price;
						break;
					}
				}
			} else if (
				option?.type === "many" &&
				typeof selections[i].value !== "string" &&
				option.args
			) {
				// Search option args for all selections
				for (let s = 0; s < selections[i].value.length; i++) {
					// For each selection find the equivalent option
					for (let i = 0; i < option.args.length; i++) {
						// If option found, add price to item price and break
						if (option.args[i].name === selections[i].value[s]) {
							item.totalPrice += option.args[i].price;
							break;
						}
					}
				}
			}
		}

		return item;
	};

	/**
	 * Creates an array of ItemTypeSelection with the default values from the ItemType's options.
	 * @return selections - An array of ItemTypeSelection.
	 */
	getDefaultSelections = () => {
		const selections: ItemTypeSelection[] = [];

		this.options.forEach((opt) => {
			selections.push({ optName: opt.optName, value: opt.default });
		});

		return selections;
	};
}

/**
 * An option for an ItemType.
 @field optName - The display name of the option.
 @field type - The type of option this option is. Type may be one of: `one`, `many`, `text`.
 @field abrv - The abbreviated name of the item. To be displayed on tickets.
 @field args - Any arguments the option type may have. Both `one` and `many` option types require an object array with keys `name`:string and `price`:number.
 @field default - The default value of this option. Can be a string for types `one` or `text`, or a string array for type `many`.
 */
export interface ItemTypeOption {
	optName: string;
	type: string;
	abrv?: string;
	args?: { name: string; price: number }[];
	default: string | string[];
}

/**
 * A selection made on an ItemTypeOption. Only necessary for types
 @field optName - The option this selection pertains to.
 @field value - The value of this selection. Can be type string if the type is `text` or `one`, or string array if the option type is `many`.
 */
export interface ItemTypeSelection {
	optName: string;
	value: string | string[];
}

export interface Item {
	name: string;
	imgUrl: string | undefined;
	description: string;
	id: string;
	selections: ItemTypeSelection[];
	totalPrice: number;
}

const ItemSchema = z.object({
	name: z.string(),
	imgUrl: z.string().optional(),
	description: z.string(),
	id: z.string(),
	selections: z.array(
		z.object({
			optName: z.string(),
			value: z.union([z.string(), z.array(z.string())]),
		}),
	),
	totalPrice: z.number(),
});
export function isItem(item: Item) {
	return ItemSchema.parse(item);
}
