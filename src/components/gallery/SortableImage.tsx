import React from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

interface Props {
  id: string;
  src: string;
  alt?: string;
  selected: boolean;
  onSelect: () => void;
}


export function SortableImage({
  id,
  src,
  alt,
  selected,
  onSelect,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });


  const style: React.CSSProperties = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };


  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      onClick={onSelect}
      style={{
        ...style,
        padding: 0,
        border: selected
          ? "3px solid #2563eb"
          : "1px solid #cbd5e1",
        borderRadius: "6px",
        overflow: "hidden",
        background: "white",
        cursor: "grab",
      }}
    >
      <img
        src={src}
        alt={alt ?? ""}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </button>
  );
}
