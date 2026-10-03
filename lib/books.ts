/**
 * Your bookshelf. Edit this array and redeploy.
 */

export type BookStatus = "reading" | "read" | "next";

export type Book = {
  title: string;
  author: string;
  status: BookStatus;
  /** Your own one-line takeaway (or why it's next). */
  takeaway: string;
  /** 1–5, only for books you've read. */
  rating?: number;
  /** 0–100, only for books you're reading. */
  progress?: number;
  /** Free-form topic, e.g. "Strategy", "Campaigns". */
  category?: string;
  /** Optional cover image URL. Without one, a cover is generated. */
  cover?: string;
  /** Marks starter entries. Delete these once you add your own. */
  example?: boolean;
};

export const statusLabels: Record<BookStatus, string> = {
  reading: "Currently Reading",
  read: "Read",
  next: "Up Next",
};

// TODO: replace these three starter entries with your own.
export const books: Book[] = [
  {
    title: "Your current read",
    author: "Author name",
    status: "reading",
    progress: 40,
    category: "Strategy",
    takeaway: "Write the one idea from this book you are already using at work.",
    example: true,
  },
  {
    title: "A book that changed how you work",
    author: "Author name",
    status: "read",
    rating: 5,
    category: "Leadership",
    takeaway: "Your key takeaway, in your own words, in one sentence.",
    example: true,
  },
  {
    title: "Next on your list",
    author: "Author name",
    status: "next",
    category: "Product",
    takeaway: "Why you are reading it next.",
    example: true,
  },
];
