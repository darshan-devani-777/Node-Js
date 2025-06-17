const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const { StatusCodes } = require("http-status-codes");

// CREATE ORDER - ONLY USER
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Only users can place an order.",
      });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || !user.address || !user.address.street || !user.address.city) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User address is missing or incomplete.",
      });
    }

    const address = user.address;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Cart is empty. Please add items before placing an order.",
      });
    }

    let totalAmount = 0;
    const orderProducts = cart.products.map((item) => {
      const price = item.product.price;
      const quantity = item.quantity;
      totalAmount += price * quantity;

      return {
        product: item.product._id,
        quantity,
      };
    });

    const newOrder = new Order({
      user: userId,
      products: orderProducts,
      contact: user.contact,
      totalAmount,
      address,
    });

    console.log("New Order:", newOrder);

    const savedOrder = await newOrder.save();

    await Cart.findOneAndDelete({ user: userId });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order Placed Successfully... Cart has been cleared.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// GET ALL ORDER (admin, superadmin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image description categories");
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order Retrieved Successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Server Error" });
  }
};

// GET SPECIFIC ORDER (own order)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate("user", "name email")
      .populate("products.product", "name price image description categories");
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order Retrieved Successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Server Error" });
  }
};

// UPDATE ORDER (user only)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Order not found" });
    }
    const isAdminOrSuperAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';

    const { products, totalAmount, address, contact, paymentStatus, deliveryStatus } = req.body;

    order.products = products || order.products;
    order.totalAmount = totalAmount || order.totalAmount;
    order.address = address || order.address;
    order.contact = contact || order.contact;

    if (isAdminOrSuperAdmin) {
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    } else {
      if (paymentStatus || deliveryStatus) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ success: false, message: "You are not allowed to update payment or delivery status" });
      }
    }

    const updatedOrder = await order.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order Updated Successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Server Error" });
  }
};

// DELETE ORDER (user only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Not allowed to delete this order" });
    }

    await order.deleteOne();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order Deleted Successfully",
      deletedOrder: order,
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Server Error" });
  }
};
