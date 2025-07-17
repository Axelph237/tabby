import { Null, Type as t, type Static } from "@sinclair/typebox";
import { uuidObj } from "~/utils/types/uuid";
import { Nullable } from "~/utils/types/nullable";

const timestamps = {
	createdAt: Nullable(t.String()),
	updatedAt: Nullable(t.String()),
	deletedAt: Nullable(t.String()),
};

// DEPRECATED
export const menuTObj = t.Object({
	id: uuidObj,
	createdBy: uuidObj,
	name: t.String(),
	style: t.Optional(
		Nullable(
			t.Object({
				backgroundImg: t.Optional(t.String({ format: "uri" })),
				colors: t.Optional(
					t.Partial(
						t.Object({
							primary: t.String(),
							secondary: t.String(),
						}),
					),
				),
				checkoutMsg: t.Optional(t.String()),
			}),
		),
	),
	...timestamps,
});
export type Menu = Static<typeof menuTObj>;

// DEPRECATED
export const itemOnMenuTObj = t.Object({
	itemId: t.Integer(),
	menuId: uuidObj,
});
export type ItemOnMenu = Static<typeof itemOnMenuTObj>;

export const itemOptionTObj = t.Object({
	label: t.String(),
	type: t.Union([t.Literal("one"), t.Literal("many"), t.Literal("text")]),
});
export type ItemOption = Static<typeof itemOptionTObj>;

export const itemSelectTObj = t.Object({
	label: t.String(),
	price: t.Integer(),
	isDefault: t.Boolean(),
});
export type ItemSelection = Static<typeof itemSelectTObj>;

export const itemTObj = t.Object({
	id: t.Integer(),
	name: t.String(),
	description: t.Optional(Nullable(t.String())),
	imgUrl: t.Optional(Nullable(t.String({ format: "uri" }))),
	basePrice: t.Integer(),
	...timestamps,
});
export type Item = Static<typeof itemTObj>;

export const itemWithOptsTObj = t.Intersect([
	// Item
	itemTObj,
	t.Object({
		// Options
		options: t.Array(
			t.Intersect([
				itemOptionTObj,
				t.Object({
					// Selections
					selections: t.Array(itemSelectTObj),
				}),
			]),
		),
	}),
]);
export type ItemWithOpts = Static<typeof itemWithOptsTObj>;

export const sessionDetailsTObj = t.Object({
	id: uuidObj,
	expiresAt: Nullable(t.Date()),
	menu: t.Intersect([
		menuTObj,
		t.Object({
			items: t.Array(itemWithOptsTObj),
		}),
	]),
});
export type SessionDetails = Static<typeof sessionDetailsTObj>;
