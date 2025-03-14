import CheckoutReceipt from "~/receipt/checkout-receipt";
import { testItems } from "~/menu/menu";

export default function CheckoutPage() {
	return (
		<CheckoutReceipt
			items={testItems}
			total={10.25}
		/>
	);
}
