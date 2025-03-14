import CheckoutReceipt from "~/receipt/checkout-receipt";
import { testItems } from "~/menu/menu";
import type { Item } from "~/lib/item";

const items: Item[] = [];
for (let i = 0; i < testItems.length; i++) {
	items.push(testItems[i].createItem([]));
}

export default function CheckoutPage() {
	return (
		<CheckoutReceipt
			items={items}
			total={10.25}
		/>
	);
}
