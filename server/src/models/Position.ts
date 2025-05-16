// src/models/Position.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPosition extends Document {
  title: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPosition>('Position', PositionSchema);