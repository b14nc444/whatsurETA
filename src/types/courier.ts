export type Courier = {
  code: string;
  name: string;
  enabled: boolean;
};

export type CouriersResponse = {
  couriers: Courier[];
  updatedAt: string;
};
