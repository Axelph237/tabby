import { Type as t, type Static } from "@sinclair/typebox";
import { uuidObj } from "~/utils/types/uuid";
import { Nullable } from "~/utils/types/nullable";

// DEPRECATED
export const menuTObj = t.Object({
	id: uuidObj,
	createdAt: t.Date(),
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
	createdAt: Nullable(t.String()),
	updatedAt: Nullable(t.String()),
	deletedAt: Nullable(t.String()),
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
	menuName: t.String(),
	expiresAt: t.Date(),
	items: t.Array(itemWithOptsTObj),
});
export type SessionDetails = Static<typeof sessionDetailsTObj>;
