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

  return (
<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "#fff",
    border: "1px solid #d4d4d8",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  }}
>
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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: 600,
      fontSize: "14px",
    }}
  >
    <span>Details</span>
    <span>{open ? "▼" : "▶"}</span>
  </button>

  {open && (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
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
          <section>
            <h4
              style={{
                margin: "0 0 12px",
              }}
            >
              Gallery
            </h4>

            <label
              style={{
                display: "block",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                Title
              </div>

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
                rows={4}
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

          <section>
            <h4
              style={{
                margin: "0 0 12px",
              }}
            >
              Selected image
            </h4>

            {selectedImage ? (
              <>
                <img
                  src={selectedImage.src}
                  alt=""
                  style={{
                    width: "120px",
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


