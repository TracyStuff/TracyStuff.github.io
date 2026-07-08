import React from "react";

import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  GalleryCardProps,
} from "./types";

import {
  SortableImage,
} from "./SortableImage";


export function GalleryCard({
  item,
  selected,
  actions,
  dragHandle,
}: GalleryCardProps) {


  function handleDrop(
    event: React.DragEvent
  ) {
    event.preventDefault();
    event.stopPropagation();

    const files =
      Array.from(
        event.dataTransfer.files
      ).filter((file) =>
        file.type.startsWith("image/")
      );

    if (files.length) {
      actions.addImagesToItem(
        item.id!,
        files
      );
    }
  }


  return (
    <article
      style={{
        border:
          "1px solid #ddd",
        borderRadius:
          "10px",
        padding:
          "16px",
        background:
          "white",
      }}
    >

      <header
        {...dragHandle?.attributes}
        {...dragHandle?.listeners}
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          cursor:
            "grab",
          marginBottom:
            "12px",
        }}
      >

        <strong>
          {item.title ||
            "Untitled item"}
        </strong>


        <button
          type="button"
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={() =>
            actions.deleteGalleryItem(
              item.id!
            )
          }
        >
          ×
        </button>

      </header>


      <SortableContext
        items={
          item.media.map(
            (_image, index) =>
              `${item.id}-image-${index}`
          )
        }
        strategy={rectSortingStrategy}
      >

        <div
          style={{
            display:
              "flex",
            flexWrap:
              "wrap",
            gap:
              "8px",
          }}
        >

          {item.media.map(
            (image, index) => (

            <SortableImage
              key={
                `${item.id}-image-${index}`
              }
              id={
                `${item.id}-image-${index}`
              }
              src={image.src}
              alt={image.alt}
              selected={
                selected?.itemId === item.id &&
                selected?.imageIndex === index
              }
              onSelect={() =>
                actions.selectImage(
                  item.id!,
                  index
                )
              }
            />

          ))}

        </div>

      </SortableContext>


      <div
        onDragOver={(event) =>
          event.preventDefault()
        }
        onDrop={handleDrop}
        style={{
          marginTop:
            "16px",
          padding:
            "12px",
          border:
            "2px dashed #cbd5e1",
          borderRadius:
            "6px",
          textAlign:
            "center",
          color:
            "#64748b",
          fontSize:
            "12px",
        }}
      >
        Drop images here to add
      </div>

    </article>
  );
}
