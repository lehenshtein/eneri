export interface IGameFilters {
  search: string;
  isShowSuspended: boolean;
  gameSystemId: number | null | undefined;
  cityCode: number | null | undefined;
  sort: number;
}
