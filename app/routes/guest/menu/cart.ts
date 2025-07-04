export interface CartInit {
	items: Record<number, number>;
}

export default class Cart {
	private items: Record<number, number> = {};

	constructor(init?: CartInit) {
		if (init !== undefined) {
			this.items = init.items;
		}
	}

	getItems = () => this.items;

	setItem = (id: number, count: number) => (this.items[id] = count);

	addItem = (id: number, count: number) => {
		this.items[id] = this.items[id] ? this.items[id] + count : count;

		if (this.items[id] <= 0) delete this.items[id];
	};

	removeItem = (id: number) => delete this.items[id];

	toObject = () => ({ items: this.items });
}
