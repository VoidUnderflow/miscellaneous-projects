import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  residents: mongoose.Types.ObjectId[];
}

const AddressSchema: Schema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    residents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAddress>("Address", AddressSchema);
