import React from "react";

import { useDroppable, } from "@dnd-kit/core"

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

    const {
	setNodeRef: setDropRef,
    } = useDroppable({
	id: `card-drop-${item.id}`,
	data: {
	    type: "gallery-drop",
	    itemId: item.id,
	},
    });

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
	  ref={setDropRef}
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

	  <div>
	<button
	    type="button"
            onPointerDown={(event) =>
		event.stopPropagation()
            }
	    onClick={() => actions.editGalleryItem(item.id!)}
	    style={{paddingRight: "1em"}}
	>
	    🖉
	</button>
	  
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
	      </div>
      </header>


      <SortableContext
        items={ item.media.map( (image) => image._editorId ) }
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
		key={image._editorId}
		id={image._editorId}
		itemId={item.id!}
              src={image.src}
              alt={image.alt}
              selected={
                    selected?.imageId === image._editorId
              }
              onSelect={() =>
                actions.selectImage(
                  item.id!,
                  image._editorId!
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
