import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const adminName = req.user.name;

    // Isolate by admin
    const totalProducts = await Product.countDocuments({ createdBy: adminName });
    const lowStockProducts = await Product.find({ 
      createdBy: adminName,
      quantity: { $lt: 10 } 
    }).limit(5);

    const orders = await Order.find({ 
      assignedTo: adminName,
      status: 'Accepted' 
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = await Order.countDocuments({ assignedTo: adminName });

    // Calculate occupied shelves count
    const productsWithShelves = await Product.find({ createdBy: adminName, shelfLocation: { $ne: '' } });
    const uniqueShelves = new Set(productsWithShelves.map(p => p.shelfLocation).filter(loc => !!loc));
    const occupiedShelvesCount = uniqueShelves.size;

    res.json({
      success: true,
      message: 'Dashboard data retrieved',
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        lowStockProducts,
        occupiedShelvesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDemandForecast = async (req, res, next) => {
  try {
    const adminName = req.user.name;
    const products = await Product.find({ createdBy: adminName });

    const forecasts = [];

    for (const product of products) {
      const orders = await Order.find({
        'products.product': product._id,
        status: { $in: ['Delivered', 'Accepted', 'Shipped'] }
      });

      let totalSold = 0;
      const orderCount = orders.length;

      orders.forEach(order => {
        const item = order.products.find(p => p.product.toString() === product._id.toString());
        if (item) {
          totalSold += item.quantity;
        }
      });

      // AI Forecast simulation: base on actual sales rate
      const averageOrderSize = orderCount > 0 ? totalSold / orderCount : 0;
      const monthlyFactor = orderCount > 2 ? 3.5 : 1.5;
      const projectedSales = Math.ceil(totalSold > 0 ? totalSold * monthlyFactor : 8 + Math.floor(Math.random() * 5));
      const recommendedRestock = Math.max(0, projectedSales - product.quantity);
      const confidenceScore = orderCount > 2 ? 88 : orderCount > 0 ? 60 : 35;
      const trend = projectedSales > product.quantity ? 'Increasing' : 'Stable';

      forecasts.push({
        productId: product._id,
        name: product.name,
        category: product.category,
        currentStock: product.quantity,
        totalSold,
        projectedSales,
        recommendedRestock,
        confidenceScore,
        trend
      });
    }

    res.json({
      success: true,
      message: 'Forecasting completed successfully',
      data: forecasts
    });
  } catch (error) {
    next(error);
  }
};
