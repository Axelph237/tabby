export async function clientLoader({ menuId }: { menuId: string }) {
	const response = await fetch(`/api/menus/${menuId}`, {
		method: "GET",
	});

	if (response.ok) {
		console.log(response.json());
	}
}

export default function EditMenuPage() {
	return <div>Hello World</div>;
}
