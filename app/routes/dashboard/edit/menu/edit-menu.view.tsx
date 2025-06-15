export async function clientLoader({ params }: { params: { menuId: string } }) {
	console.log("Menu id:", params.menuId);

	const response = await fetch(`/api/menus/${params.menuId}`, {
		method: "GET",
	});

	if (response.ok) {
		console.log(await response.json());
	}
}

export default function EditMenuPage() {
	return <div>Hello World</div>;
}
