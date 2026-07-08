export interface GalleryImage {
  src: string;
  alt?: string;
  _editorId?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  media: GalleryImage[];
}

export interface SelectedImage {
  itemId: string;
  imageIndex: number;
}

export interface GalleryActions {
  addImagesToItem: (
    itemId: string,
    files: File[]
  ) => Promise<void>;

  createGalleryFromFiles: (
    files: File[]
  ) => Promise<void>;

  deleteGalleryItem: (
    itemId: string
  ) => void;

  deleteImage: (
    itemId: string,
    imageIndex: number
  ) => void;

  updateAlt: (
    itemId: string,
    imageIndex: number,
    alt: string
  ) => void;

  selectImage: (
    itemId: string,
    imageIndex: number
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
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}