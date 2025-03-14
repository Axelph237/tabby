import CheckoutReceipt from "~/receipt/checkout-receipt";
import type { Item } from "~/lib/item";
import { tItems } from "~/lib/testTypes";

export default function CheckoutPage() {
	return (
		<CheckoutReceipt
			items={tItems}
			total={10.25}
		/>
	);
}
