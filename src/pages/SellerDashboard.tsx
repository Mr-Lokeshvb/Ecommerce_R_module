import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  PackageCheck,
  ShoppingCart,
  Target,
  Truck,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const zeroStats = {
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalProfit: 0,
  averageOrderValue: 0
};

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const { orders, fetchSellerOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('orders');

  useEffect(() => {
    fetchSellerOrders();
  }, [fetchSellerOrders]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Seller Dashboard, {user?.name}
              </h1>
              <p className="text-gray-600">Order processing is enabled. Other seller dashboard modules are disabled.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:flex lg:items-center lg:space-x-6">
              <ZeroStat label="Products" value={zeroStats.totalProducts} tone="text-green-600" />
              <ZeroStat label="Orders" value={zeroStats.totalOrders} tone="text-blue-600" />
              <ZeroStat label="Revenue" value={`$${zeroStats.totalRevenue.toFixed(2)}`} tone="text-yellow-600" />
              <ZeroStat label="Profit" value={`$${zeroStats.totalProfit.toFixed(2)}`} tone="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex flex-wrap gap-4 md:gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 md:px-4 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
              <MetricCard label="Total Products" value={zeroStats.totalProducts} note="Disabled" icon={<Package className="h-8 w-8 text-green-200" />} color="from-green-500 to-green-600" />
              <MetricCard label="Total Orders" value={zeroStats.totalOrders} note="View orders tab" icon={<ShoppingCart className="h-8 w-8 text-blue-200" />} color="from-blue-500 to-blue-600" />
              <MetricCard label="Total Revenue" value={`$${zeroStats.totalRevenue.toFixed(2)}`} note="Disabled" icon={<DollarSign className="h-8 w-8 text-yellow-200" />} color="from-yellow-500 to-yellow-600" />
              <MetricCard label="Total Profit" value={`$${zeroStats.totalProfit.toFixed(2)}`} note="Disabled" icon={<Target className="h-8 w-8 text-purple-200" />} color="from-purple-500 to-purple-600" />
              <MetricCard label="Avg Order Value" value={`$${zeroStats.averageOrderValue.toFixed(2)}`} note="Disabled" icon={<BarChart3 className="h-8 w-8 text-indigo-200" />} color="from-indigo-500 to-indigo-600" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Seller modules disabled</h2>
              <p className="text-gray-600 mb-6">Products, analytics, messages, performance, and extra store information are wired out.</p>
              <button
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Manage Orders
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrdersTab orders={Array.isArray(orders) ? orders : []} fetchSellerOrders={fetchSellerOrders} />
        )}
      </div>
    </div>
  );
};

const ZeroStat = ({ label, value, tone }: { label: string; value: number | string; tone: string }) => (
  <div className="text-center">
    <div className={`text-xl md:text-2xl font-bold ${tone}`}>{value}</div>
    <div className="text-xs md:text-sm text-gray-600">{label}</div>
  </div>
);

const MetricCard = ({
  label,
  value,
  note,
  icon,
  color
}: {
  label: string;
  value: number | string;
  note: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`bg-gradient-to-r ${color} rounded-2xl shadow-lg p-6 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
        <p className="text-white/70 text-xs mt-1">{note}</p>
      </div>
      {icon}
    </div>
  </div>
);

const OrdersTab: React.FC<{ orders: any[]; fetchSellerOrders: () => void }> = ({ orders, fetchSellerOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipping': return 'text-blue-600 bg-blue-100';
      case 'packing': return 'text-purple-600 bg-purple-100';
      case 'confirmed': return 'text-indigo-600 bg-indigo-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const payload: any = { status };

      if (status === 'shipping') {
        if (!trackingNumber || !carrier) {
          toast.error('Please provide tracking number and carrier');
          return;
        }
        payload.trackingNumber = trackingNumber;
        payload.carrier = carrier;
      }

      await axios.put(
        `http://localhost:5000/api/seller/orders/${orderId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Order status updated successfully');
      setShowStatusModal(false);
      setSelectedOrder(null);
      setTrackingNumber('');
      setCarrier('');
      fetchSellerOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'packing': return <PackageCheck className="h-4 w-4" />;
      case 'shipping': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = filterStatus === 'all'
    ? safeOrders
    : safeOrders.filter(order => order.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-2xl font-semibold text-gray-900">Manage Orders</h3>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="packing">Packing</option>
          <option value="shipping">Shipping</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      Order #{order.orderNumber || order._id?.slice(-8) || order.id}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900">
                        {order.customer?.name || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Customer'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-medium text-gray-900">{order.items?.length || 0} products</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium text-gray-900">${Number(order.total || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Tracking:</strong> {order.trackingNumber} ({order.carrier})
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Update Status
                    </button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm text-center font-medium">
                      No Action
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {item.title} x{item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Update Order Status
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status:</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'confirmed')}
                  disabled={selectedOrder.status !== 'pending'}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Confirm Order
                </button>

                <button
                  onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'packing')}
                  disabled={selectedOrder.status !== 'confirmed'}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <PackageCheck className="h-5 w-5" />
                  Start Packing
                </button>

                {selectedOrder.status === 'packing' && (
                  <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Carrier (e.g. FedEx, UPS)"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'shipping')}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Truck className="h-5 w-5" />
                      Mark as Shipped
                    </button>
                  </div>
                )}

                <button
                  onClick={() => updateOrderStatus(selectedOrder._id || selectedOrder.id, 'delivered')}
                  disabled={selectedOrder.status !== 'shipping'}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Mark as Delivered
                </button>
              </div>

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setTrackingNumber('');
                  setCarrier('');
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
