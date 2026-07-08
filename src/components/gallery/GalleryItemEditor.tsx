
import React, {
  useEffect,
  useState,
} from "react";

import { useCMS } from "tinacms";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  SortableGalleryCard,
} from "./SortableGalleryCard";

import type {
  GalleryItem,
  GalleryImage,
  SelectedImage,
} from "./types";


function withEditorIds(
  items: GalleryItem[]
): GalleryItem[] {

  return items.map((item) => ({
    ...item,

    id:
      item.id ??
      crypto.randomUUID(),

    media:
      (item.media ?? []).map(
        (image: GalleryImage) => ({
          ...image,

          _editorId:
            image._editorId ??
            crypto.randomUUID(),
        })
      ),
  }));
}


function stripEditorIds(
  items: GalleryItem[]
): GalleryItem[] {

  return items.map((item) => ({
    ...item,

    media:
      item.media.map(
        ({
          _editorId,
          ...image
        }) => image
      ),
  }));
}



export function GalleryItemsEditor({
  input,
}: any) {

  const cms = useCMS();

  const [
    items,
    setItems,
  ] = useState<GalleryItem[]>(() =>
    withEditorIds(
      input.value ?? []
    )
  );


  const [
    selected,
    setSelected,
  ] = useState<SelectedImage | null>(
    null
  );


  useEffect(() => {

    input.onChange(
      stripEditorIds(items)
    );

  }, [items]);


  function updateItems(
    next: GalleryItem[]
  ) {
    setItems(
      withEditorIds(next)
    );
  }



    async function uploadMedia(files: File[]) {
	// Prototype interface from 3.10.0
	// console.log(cms.media.store);
      const store = cms.media?.store;

      if (!store) {
	  throw new Error("Tina media store unavailable");
      }

	const payload = files.map((file) => ({
	    file,
	    directory: "",
	}));

	const uploaded = await store.persist(payload);

      return uploaded.map((item) => ({
	  src: item.src,
	  alt: item.filename,
      }));
  }
    async function uploadImages(files: File[]) {
	const uploaded = await uploadMedia(files);

	return uploaded.map((item) => ({
	    src: item.src,
	    alt: item.filename,
	    _editorId: crypto.randomUUID(),
	}));

    }

  async function addImagesToItem(
    itemId: string,
    files: File[]
  ) {

    const images =
      await uploadImages(files);


    updateItems(
      items.map((item) => {

        if (item.id !== itemId) {
          return item;
        }


        return {
          ...item,

          media: [
            ...item.media,
            ...images,
          ],
        };

      })
    );
  }



  async function createGalleryFromFiles(
    files: File[]
  ) {

    const images =
      await uploadImages(files);


    updateItems([
      ...items,

      {
        id:
          crypto.randomUUID(),

        title:
          files.length === 1
            ? files[0].name.replace(
                /\.[^/.]+$/,
                ""
              )
            : `${files.length} images`,

        caption:
          "",

        media:
          images,
      },
    ]);

  }



  function deleteGalleryItem(
    itemId: string
  ) {

    updateItems(
      items.filter(
        (item) =>
          item.id !== itemId
      )
    );


    if (
      selected?.itemId === itemId
    ) {
      setSelected(null);
    }

  }



  function deleteImage(
    itemId: string,
    imageIndex: number
  ) {

    updateItems(
      items.map((item) => {

        if (item.id !== itemId) {
          return item;
        }


        return {
          ...item,

          media:
            item.media.filter(
              (_, index) =>
                index !== imageIndex
            ),
        };

      })
    );


    setSelected(null);
  }



  function updateAlt(
    itemId: string,
    imageIndex: number,
    alt: string
  ) {

    updateItems(
      items.map((item) => {

        if (item.id !== itemId) {
          return item;
        }


        return {
          ...item,

          media:
            item.media.map(
              (image, index) =>
                index === imageIndex
                  ? {
                      ...image,
                      alt,
                    }
                  : image
            ),
        };

      })
    );

  }

    function handleCreateGalleryDrop(
	event: React.DragEvent<HTMLDivElement>
				  ) {
	event.preventDefault();
	event.stopPropagation();

	const files = Array.from(event.dataTransfer.files).filter((file) =>
	    file.type.startsWith("image/")
	);

	if (files.length) {
	    void createGalleryFromFiles(files);
	}
    }

  function handleItemDragEnd(
    event: any
  ) {

    const {
      active,
      over,
    } = event;


    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }


    const oldIndex =
      items.findIndex(
        (item) =>
          item.id === active.id
      );

    const newIndex =
      items.findIndex(
        (item) =>
          item.id === over.id
      );

    updateItems(
      arrayMove(
        items,
        oldIndex,
        newIndex
      )
    );

  }



  const actions = {
    addImagesToItem,
    createGalleryFromFiles,
    deleteGalleryItem,
    deleteImage,
    updateAlt,

    selectImage(
      itemId: string,
      imageIndex: number
    ) {

      setSelected({
        itemId,
        imageIndex,
      });
    },
  };



  return (

    <DndContext
      collisionDetection={
        closestCenter
      }
      onDragEnd={
        handleItemDragEnd
      }
    >

	<div
	    style={{
		display: "flex",
		flexDirection: "column",
		gap: "20px",
	    }}
	>
	    <div
		onDragOver={(e) => e.preventDefault()}
		onDrop={handleCreateGalleryDrop}
		style={{
		    border: "2px dashed #94a3b8",
		    borderRadius: "8px",
		    padding: "20px",
		    textAlign: "center",
		    color: "#64748b",
		    background: "#f8fafc",
		}}
	    >
		Drop images here to create a new gallery item
	    </div>
	    
      <div
        onDragOver={(event) =>
          event.preventDefault()
        }
        onDrop={(event) => {

          event.preventDefault();

          const files =
            Array.from(
              event.dataTransfer.files
            ).filter((file) =>
              file.type.startsWith(
                "image/"
              )
            );


          if (files.length) {
            createGalleryFromFiles(
              files
            );
          }

        }}

        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "20px",
        }}
      >
        <SortableContext
          items={
            items.map(
              (item) =>
                item.id!
            )
          }
          strategy={
            rectSortingStrategy
          }
        >

          {items.map((item) => (

            <SortableGalleryCard
              key={item.id}
              item={item}
              selected={selected}
              actions={actions}
            />

          ))}

        </SortableContext>

      </div>
     </div>


    </DndContext>

  );
}
