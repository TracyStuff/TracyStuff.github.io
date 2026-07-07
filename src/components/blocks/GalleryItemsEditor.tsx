import React, { useState } from "react";

export function GalleryItemsEditor({ input }: any) {
  const items = input.value ?? [];

  const [selected, setSelected] = useState<{
    itemIndex: number;
    imageIndex: number;
  } | null>(null);

  function updateItems(nextItems: any[]) {
    input.onChange(nextItems);
  }

  function updateImageAlt(value: string) {
    if (!selected) return;

    const nextItems = structuredClone(items);

    nextItems[selected.itemIndex].media[selected.imageIndex].alt = value;

    updateItems(nextItems);
  }

  function deleteImage() {
    if (!selected) return;

    const nextItems = structuredClone(items);

    nextItems[selected.itemIndex].media.splice(
      selected.imageIndex,
      1
    );

    updateItems(nextItems);
    setSelected(null);
  }

  function addItem() {
    updateItems([
      ...items,
      {
        title: "",
        caption: "",
        media: [],
      },
    ]);
  }

  function deleteItem(index: number) {
    const nextItems = items.filter(
      (_: any, i: number) => i !== index
    );

    updateItems(nextItems);
    setSelected(null);
  }

  const selectedImage =
    selected &&
    items[selected.itemIndex]?.media?.[selected.imageIndex];

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ flex: 1 }}>
        <button
          type="button"
          onClick={addItem}
          style={{
            marginBottom: "20px",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          + Add Gallery Item
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item: any, itemIndex: number) => (
            <div
              key={itemIndex}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>
                  {item.title || `Item ${itemIndex + 1}`}
                </strong>

                <button
                  type="button"
                  onClick={() => deleteItem(itemIndex)}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >
                {(item.media ?? []).map(
                  (img: any, imageIndex: number) => (
                    <button
                      key={imageIndex}
                      type="button"
                      onClick={() =>
                        setSelected({
                          itemIndex,
                          imageIndex,
                        })
                      }
                      style={{
                        padding: 0,
                        border:
                          selected?.itemIndex === itemIndex &&
                          selected?.imageIndex === imageIndex
                            ? "3px solid #2563eb"
                            : "1px solid #ccc",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt || ""}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <aside
          style={{
            width: "280px",
            borderLeft: "1px solid #ddd",
            paddingLeft: "20px",
          }}
        >
          <h3>Image Details</h3>

          <img
            src={selectedImage.src}
            alt=""
            style={{
              width: "100%",
              marginBottom: "16px",
            }}
          />

          <label>
            Alt text
            <textarea
              value={selectedImage.alt ?? ""}
              onChange={(e) =>
                updateImageAlt(e.target.value)
              }
              style={{
                width: "100%",
                minHeight: "80px",
                marginTop: "8px",
              }}
            />
          </label>

          <button
            type="button"
            onClick={deleteImage}
            style={{
              marginTop: "16px",
              color: "white",
              background: "#dc2626",
              border: 0,
              padding: "8px 12px",
              borderRadius: "5px",
            }}
          >
            Delete Image
          </button>
        </aside>
      )}
    </div>
  );
}
