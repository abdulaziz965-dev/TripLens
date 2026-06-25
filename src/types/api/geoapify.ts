export interface GeoapifyGeocodeResponse {
  features: {
    geometry: {
      coordinates: [number, number];
    };
  }[];
}

export interface GeoapifyPlace {
  properties: {
    place_id?: string;

    name?: string;

    formatted?: string;

    categories?: string[];

    rank?: {
      importance?: number;
    };
  };
}

export interface GeoapifyPlacesResponse {
  features: GeoapifyPlace[];
}