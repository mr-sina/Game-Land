import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import mongoosePaginate from "mongoose-paginate";

const Game: mongoose.Schema = new mongoose.Schema(
  {
    seller: {
      type: ObjectId,
      ref: "Seller",
    },
    category: {
        type: ObjectId,
        ref: "Category"
      },
    title: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    discount: {
      type: ObjectId,
      ref: "Discount",
    },
    imageId: [
      {
        type: String,
        default: null,
      },
    ],
  },
  { timestamps: true }
);

Game.plugin(mongoosePaginate);

export default mongoose.model("Game", Game);
