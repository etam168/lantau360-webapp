export interface TableBottomScope {
  pagination: {
    sortBy: string | null;
    descending: boolean;
    page: number;
    rowsPerPage: number;
  };
  pagesNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstPage: () => void;
  prevPage: () => void;
  nextPage: () => void;
  lastPage: () => void;
  inFullscreen: boolean;
  toggleFullscreen: () => void;
}
