import React, { useState } from "react";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import { useCMS } from "tinacms";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


function SortableGalleryCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}


export function GalleryItemsEditor({ input }: any) {
  const cms = useCMS();
  const items = input.value ?? [];
    
  const [selected, setSelected] = useState<{
    itemIndex: number;
    imageIndex: number;
  } | null>(null);


  function updateItems(nextItems: any[]) {
    input.onChange(nextItems);
  }


  function updateAlt(value: string) {
    if (!selected) return;

    const next = structuredClone(items);

    next[selected.itemIndex]
      .media[selected.imageIndex]
      .alt = value;

    updateItems(next);
  }


  function deleteImage() {
    if (!selected) return;

    const next = structuredClone(items);

    next[selected.itemIndex]
      .media
      .splice(selected.imageIndex, 1);

    updateItems(next);
    setSelected(null);
  }


  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (_: any, index: number) =>
        `gallery-${index}` === active.id
    );

    const newIndex = items.findIndex(
      (_: any, index: number) =>
        `gallery-${index}` === over.id
    );

    updateItems(
      arrayMove(items, oldIndex, newIndex)
    );
  }

  async function uploadImage(file: File) {
      const response = await cms.api.tina.media.store.upload({
	  file,
      });
      return response;
  }    

  function filesToMedia(files: File[]) {
	return files.map((file) => ({
	    src: URL.createObjectURL(file),
	    alt: "",
	}));
    }    

    async function handleDrop(
	event: React.DragEvent,
	itemIndex?: number
    ) {
	event.preventDefault();

	const files = Array.from(event.dataTransfer.files)
	      .filter((file) =>
		  file.type.startsWith("image/")
	      );

	if (!files.length) return;

	const uploadedImages = await Promise.all(
	    files.map(async (file) => {
		const result = await uploadImage(file);

		return {
		    src: result.path,
		    alt: "",
		};
	    })
	);


	const next = structuredClone(items);

	if (itemIndex !== undefined) {
	    next[itemIndex].media = [
		...(next[itemIndex].media ?? []),
		...uploadedImages,
	    ];
	} else {
	    next.push({
		title:
		files.length === 1
		    ? files[0].name.replace(
			/\.[^/.]+$/,
			""
		    )
		    : `${files.length} images`,
		caption: "",
		media: uploadedImages,
	    });
	}

	updateItems(next);
    }


  return (
    <div
      style={{
            display: "flex",
            gap: "24px",
	    minHeight: "400px",
	    width: "100%"
	    minWidth: 0,		      
      }}
    >

	<main style={{
		  flex: 1,
	          minWidth: 0,
	    }}>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={items.map(
              (_: any, i: number) =>
                `gallery-${i}`
            )}
            strategy={rectSortingStrategy}
          >

	      <div
		  onDragOver={(event) => {
		      event.preventDefault();
		  }}
		  onDrop={(event) =>
		      handleDrop(event)
		  }
		  style={{
		      display: "grid",
		      gridTemplateColumns:
		      "repeat(auto-fill, minmax(150px, 1fr))",
		      gap: "20px",
		  }}
	      >

              {items.map(
                (item: any, itemIndex: number) => (

                  <SortableGalleryCard
                    key={itemIndex}
                    id={`gallery-${itemIndex}`}
                  >

                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "16px",
                        background: "white",
                      }}
                    >

                      <strong>
                        {item.title ||
                          `Gallery item ${itemIndex + 1}`}
                      </strong>


                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginTop: "12px",
                        }}
                      >

                        {(item.media ?? []).map(
                          (img: any, imageIndex: number) => (

                            <button
                              key={imageIndex}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                setSelected({
                                  itemIndex,
                                  imageIndex,
                                });
                              }}
                              style={{
                                padding: 0,
                                border:
                                  selected?.itemIndex === itemIndex &&
                                  selected?.imageIndex === imageIndex
                                    ? "3px solid blue"
                                    : "1px solid #ccc",
                              }}
                            >

                              <img
                                src={img.src}
                                alt={img.alt ?? ""}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />

                            </button>

                          )
                        )}
			  <div
			      onDragOver={(event) => {
				  event.preventDefault();
			      }}
			      onDrop={(event) =>
				  handleDrop(event, itemIndex)
			      }
			      style={{
				  marginTop: "16px",
				  padding: "20px",
				  border: "2px dashed #ccc",
				  borderRadius: "8px",
				  textAlign: "center",
				  color: "#666",
			      }}
			  >
			      Drop images here
			  </div>
                      </div>

                    </div>

                  </SortableGalleryCard>

                )
              )}

            </div>
	      <div
		  onDragOver={(event) =>
		      event.preventDefault()
		  }
		  onDrop={(event) =>
		      handleDrop(event)
		  }
		  style={{
		      border: "2px dashed #94a3b8",
		      padding: "20px",
		      marginBottom: "20px",
		      textAlign: "center",
		      borderRadius: "8px",
		      color: "#64748b",
		  }}
	      >
		  Drop images here to create a new gallery item
	      </div>
          </SortableContext>

        </DndContext>

      </main>


      {selected && (
        <aside
          style={{
		width: "280px",
		flexShrink: 0,
          }}
        >

          <h3>
            Image Details
          </h3>


          <textarea
            value={
              items[selected.itemIndex]
                .media[selected.imageIndex]
                .alt ?? ""
            }
            onChange={(event) =>
              updateAlt(event.target.value)
            }
            placeholder="Alt text"
            style={{
              width: "100%",
              minHeight: "100px",
            }}
          />


          <button
            type="button"
            onClick={deleteImage}
            style={{
              marginTop: "12px",
            }}
          >
            Delete Image
          </button>

        </aside>
      )}

    </div>
  );
}
