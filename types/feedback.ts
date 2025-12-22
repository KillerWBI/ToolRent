export type Feedback = {
  _id: { $oid: string };
  name: string;
  description: string;
  rate: number;
};

export type UIFeedback = {
  id: string;
  name: string;
  description: string;
  rate: number;
};