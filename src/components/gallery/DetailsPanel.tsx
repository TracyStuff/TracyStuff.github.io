import React from "react";

import type {
  GalleryItem,
  GalleryImage,
} from "./types";


interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedItem: GalleryItem | null;
  selectedImage: GalleryImage | null;

  updateGalleryItem: (
    id: string,
    patch: Partial<GalleryItem>
  ) => void;

  updateImage: (
    itemId: string,
    imageId: string,
    patch: Partial<GalleryImage>
  ) => void;
}

export function DetailsPanel({
  open,
  setOpen,
  selectedItem,
  selectedImage,
  updateGalleryItem,
  updateImage,
}: Props) {

  open = !open;			// start closed

  return (
      <div class="w-full flex-none sticky bottom-0 max-h-[50vh] overflow-y-auto bg-white border border-zin-300 rouned-lg pt-4">
  <button
    type="button"
    onClick={() =>
      setOpen((open) => !open)
    }
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "none",
      background: "transparent",
      cursor: "pointer",
	  // display: "flex",
	  // justifyContent: "space-between",
	  // alignItems: "center",
	  fontWeight: 600,
	  fontSize: "14px",
    }}
  >
    <span>Details</span>
    <span>{open ? "▼" : "▶"}</span>
  </button>

  {open && (
      <div class="flex overflow-visible p-8 overflow-y-auto w-full"
      style={{
	    padding: "2em",
	}}
    >
      {!selectedItem ? (
        <div
          style={{
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          Select a gallery or image to edit its metadata.
        </div>
      ) : (
        <>
          <section class="flex-1">

            <label
              style={{
                display: "block",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                      marginRight: "1em",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                  Gallery Item Title:
              </span>

              <input
                type="text"
                value={selectedItem.title}
                onChange={(event) =>
                  updateGalleryItem(
                    selectedItem.id!,
                    {
                      title:
                        event.target.value,
                    }
                  )
                }
                style={{
                  width: "100%",
                }}
              />
            </label>

            <label
              style={{
                display: "block",
              }}
            >
              <div
                style={{
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                Caption
              </div>

              <textarea
                rows={2}
                value={selectedItem.caption}
                onChange={(event) =>
                  updateGalleryItem(
                    selectedItem.id!,
                    {
                      caption:
                        event.target.value,
                    }
                  )
                }
                style={{
                  width: "100%",
                  resize: "vertical",
                }}
              />
            </label>
          </section>

          <section class="flex-1">
            {selectedImage ? (
              <>
                <img
                  src={selectedImage.src}
                  alt=""
                  style={{
                    "max-width": "120px",
                    "max-height":"120px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "4px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Alt text
                  </div>

                  <input
                    type="text"
                    value={selectedImage.alt}
                    onChange={(event) =>
                      updateImage(
                        selectedItem.id!,
                        selectedImage._editorId!,
                        {
                          alt:
                            event.target.value,
                        }
                      )
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </label>
              </>
            ) : (
              <div
                style={{
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                No image selected.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )}
</div>
  );
}


