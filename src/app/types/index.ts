declare global {
  type Item = {
    id?: string | undefined;
    name: string;
    quantity: number;
    price: number;
  };
}

export {};
