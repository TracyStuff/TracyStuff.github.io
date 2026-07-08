import type { Action } from '../../lib/data';
import { GalleryItemsEditor } from "../gallery/GalleryItemsEditor";

import type { Template } from 'tinacms';

const mediaItemFields = [
	{
			type: 'image',
		label: 'Media',
		name: 'src',
	},
	{
			type: 'string',
		label: 'Alt Text',
		name: 'alt',
	},
];

const galleryItemFields = [
	{
			type: 'string',
		label: 'Title',
		name: 'title',
	},
	{
			type: 'string',
		label: 'Caption',
		name: 'caption',
		ui: {
			component: 'textarea',
		},
	},
	{
			type: 'object',
		label: 'Media',
		name: 'media',
		list: true,
		fields: mediaItemFields,
	},
];

export const galleryBlockSchema: Template = {
	name: 'gallery',
	label: 'Gallery',
	fields: [
		{
			type: 'string',
			label: 'Gallery ID',
			name: 'id',
			description: 'Optional unique identifier for this gallery.',
		},
		{
			type: 'object',
			label: 'Items',
			name: 'items',
			list: true,
			fields: galleryItemFields,
			ui: {
				component: GalleryItemsEditor,
  			},
		},
	],
	ui: {
		defaultItem: {
			id: '',
		},
	},
};
