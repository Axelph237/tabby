import Item from "~/lib/+types/item";
import { i } from "framer-motion/m";

export default class ItemType {
	// READONLY member `id` is the UUID of the item type.
	readonly id: string;
	// READONLY member `name` represents the name of the ItemType.
	readonly name: string;
	// READONLY member `imgUrl` is the source of an image representing the ItemType.
	readonly imgUrl: string | undefined;
	// READONLY member `desc` represents a description of the ItemType.
	readonly desc: string;
	// READONLY member `basePrice` is the minimum price of this object before selection modifiers are considered.
	readonly basePrice: number;
	// READONLY member `options` contains a Map linking option objects with string keys.
	readonly options: ItemOption[];

	constructor(details: ItemTypeDetails) {
		this.id = details.id;
		this.name = details.name;
		this.imgUrl = details.imgUrl;
		this.desc = details.desc;
		this.basePrice = details.basePrice;

		if (details.options) this.options = details.options;
		else this.options = [];
	}

	/**
	 * Creates a new option for the ItemType.
	 * @param option - The details of the option to add.
	 * @returns The newly created option, the old option if it already exists, or undefined if the option was an incorrect type.
	 */
	newOption = (option: ItemOption) => {
		if (
			[ItemOptionType.One, ItemOptionType.Many, ItemOptionType.Text].includes(
				option.type,
			)
		) {
			const opt = this.options.find((opt) => option.optName === opt.optName);
			if (opt) {
				// Option already exists
				console.warn(
					"Attempted to add option that already exists on type:",
					ItemType,
				);
				return opt;
			} else {
				// Option is valid
				this.options.push(option);
				return option;
			}
		} else {
			console.warn("Attempted to add options with incorrect type:", option);
			return undefined;
		}
	};

	/**
	 * Removes the option with the given name from the list.
	 * @param optName - The name of the option to remove.
	 * @returns The option removed, or undefined if the option could not be found.
	 */
	removeOption = (optName: string) => {
		const i = this.options.findIndex((opt) => optName === opt.optName);

		if (i > 0) {
			return this.options.splice(i, 1);
		}
		return undefined;
	};

	/**
	 * Creates a new item from this type given a set of option selections.
	 * @param optSelections - The options for the created item type.
	 */
	createItem = (optSelections?: ItemOptionSelection[]) => {
		return new Item(this, optSelections ?? []);
	};

	/**
	 * @returns A list of all options (that have default values) and their default
	 * values on this type, or undefined if no options are defined.
	 */
	getDefaultSelections = () => {
		if (!this.options) return undefined;

		const defaults: ItemOptionSelection[] = [];
		for (let i = 0; i < this.options.length; i++) {
			// If type is multi-select
			if (
				[ItemOptionType.Many, ItemOptionType.One].includes(this.options[i].type)
			) {
				// Get all default options from optSet
				const defaultOptSet: {
					label: string;
					priceAdj: number;
					isDefault: boolean;
				}[] = [];
				this.options[i].optSet.forEach((opt) => {
					if (opt.isDefault) defaultOptSet.push(opt);
				});
				this.options[i].optSet = defaultOptSet;

				defaults.push(this.options[i]);
			}
			// If type is text and has a value in optSet
			else if (
				this.options[i].type === ItemOptionType.Text &&
				this.options[i].optSet.length === 1
			) {
				defaults.push(this.options[i]);
			}
		}

		return defaults;
	};

	toString = () => {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			imgUrl: this.imgUrl,
			desc: this.desc,
			basePrice: this.basePrice,
			options: this.options,
		});
	};
}

interface ItemTypeDetails {
	id: string;
	name: string;
	imgUrl: string | undefined;
	desc: string;
	basePrice: number;
	options: ItemOption[] | undefined;
}

export enum ItemOptionType {
	Text,
	One,
	Many,
}

/**
 * An option category for an ItemType
 */
export interface ItemOption {
	optName: string;
	type: ItemOptionType;
	abrv?: string;
	optSet: {
		label: string;
		priceAdj: number;
		isDefault: boolean;
	}[];
}

/**
 * A selection of values for a given option, or a single value for a text option.
 */
export interface ItemOptionSelection {
	optName: string;
	valueSet?: { label: string; priceAdj: number }[];
	value?: { label: string; priceAdj: number };
}
