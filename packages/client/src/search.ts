import { GlobalContextType } from ".";

export type SearchResult = {
  label: string;
  action: (params: SearchActionParams) => void;
};

export type SearchActionParams = {
  navigate: (path: string) => void;
  ctx: GlobalContextType;
};
