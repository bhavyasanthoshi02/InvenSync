import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide product quantity'],
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'Out of Stock',
    },

    // ✅ Changed from ObjectId → String
    createdBy: {
      type: String,
      required: true,
    },
    shelfLocation: {
      type: String,
      default: '',
    },
    batchNumber: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: Date,
    },
    versions: [
      {
        quantity: { type: Number },
        price: { type: Number },
        updatedBy: { type: String },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Auto status calculation (fallback)
productSchema.pre('save', async function () {
  // Only auto-calculate if status hasn't been manually set or changed explicitly
  if (!this.isModified('status')) {
    if (this.quantity <= 0) {
      this.status = 'Out of Stock';
    } else if (this.quantity <= 10) {
      this.status = 'Low Stock';
    } else {
      this.status = 'In Stock';
    }
  }
});

productSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();

  // If status is being explicitly set in the update, don't overwrite it
  if (update.status) return;

  // Otherwise, if quantity is changing, update status
  if (update.quantity !== undefined) {
    if (update.quantity <= 0) update.status = 'Out of Stock';
    else if (update.quantity <= 10) update.status = 'Low Stock';
    else update.status = 'In Stock';
  }
});



const Product = mongoose.model('Product', productSchema);
export default Product;