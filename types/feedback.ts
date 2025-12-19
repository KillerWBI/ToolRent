export type Feedback = {
  _id: { $oid: string };
  name: string;
  description: string;
  rate: number;
};