export async function clientLoader({ params }: { menuId: string }) {
	const response = await fetch(`/api/menus/${params.menuId}`);

	if (response.ok) {
		console.log(response.json());
	}
}

export default function EditMenuPage() {}
