export interface GalleryImage {
  src: string;
  alt?: string;
  _editorId: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  media: GalleryImage[];
}

export interface SelectedImage {
  itemId: string;
  imageId: string;
}

export interface GalleryActions {
  addImagesToItem: (
    itemId: string,
    files: File[]
  ) => Promise<void>;

  createGalleryFromFiles: (
    files: File[]
  ) => Promise<void>;

  editGalleryItem: (
    itemId: string
  ) => void;

  deleteGalleryItem: (
    itemId: string
  ) => void;

  deleteImage: (
    itemId: string,
    imageId: string
  ) => void;

  updateGalleryItem: (
    itemId: string,
    patch: Partial<GalleryItem>
  ) => void;

  updateImage: (
    itemId: string,
    imageId: string,
    patch: Partial<GalleryImage>
  ) => void;

  selectImage: (
    itemId: string,
    imageId: string
  ) => void;
}

export interface GalleryCardProps {
  item: GalleryItem;
  selected: SelectedImage | null;
  actions: GalleryActions;

  /**
   * Passed through from dnd-kit.
   * We intentionally avoid importing dnd-kit's internal listener types.
   */
  dragHandle?: {
    attributes: Record<string, any>;
    listeners: Record<string, any>;
  };
}
