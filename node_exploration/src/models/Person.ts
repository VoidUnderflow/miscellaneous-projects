import mongoose, { Schema, Document } from "mongoose";

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: mongoose.Types.ObjectId[];
}

const PersonSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPerson>("Person", PersonSchema);
