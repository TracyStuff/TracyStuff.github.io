import React from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import { GalleryCard } from "./GalleryCard";

import type {
  GalleryCardProps,
} from "./types";


interface Props {
  item: GalleryCardProps["item"];
  selected: GalleryCardProps["selected"];
  actions: GalleryCardProps["actions"];
}


export function SortableGalleryCard({
  item,
  selected,
  actions,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
      id: item.id!,
      data: {
	  type: "gallery",
      },
  });


  const style: React.CSSProperties = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <GalleryCard
        item={item}
        selected={selected}
        actions={actions}
        dragHandle={{
          attributes,
          listeners,
        }}
      />
    </div>
  );
}
