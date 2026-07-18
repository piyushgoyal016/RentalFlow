// ============================================
// RentFlow — Mock Data for Admin Dashboard
// ============================================

// Categories
export const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Laptops, cameras, projectors and more', productCount: 12, status: 'active', icon: '💻', createdAt: '2025-01-15' },
  { id: 2, name: 'Furniture', slug: 'furniture', description: 'Tables, chairs, desks for events', productCount: 18, status: 'active', icon: '🪑', createdAt: '2025-01-15' },
  { id: 3, name: 'Vehicles', slug: 'vehicles', description: 'Cars, bikes, vans for transport', productCount: 8, status: 'active', icon: '🚗', createdAt: '2025-02-01' },
  { id: 4, name: 'Tools', slug: 'tools', description: 'Power tools, hand tools, equipment', productCount: 15, status: 'active', icon: '🔧', createdAt: '2025-02-10' },
  { id: 5, name: 'Audio/Visual', slug: 'audio-visual', description: 'Speakers, mics, screens, projectors', productCount: 10, status: 'active', icon: '🎵', createdAt: '2025-03-01' },
  { id: 6, name: 'Camping', slug: 'camping', description: 'Tents, sleeping bags, outdoor gear', productCount: 7, status: 'active', icon: '⛺', createdAt: '2025-03-15' },
  { id: 7, name: 'Party Supplies', slug: 'party-supplies', description: 'Decorations, lighting, party essentials', productCount: 9, status: 'active', icon: '🎉', createdAt: '2025-04-01' },
  { id: 8, name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', productCount: 6, status: 'inactive', icon: '⚽', createdAt: '2025-04-15' },
];

// Products
export const products = [
  { id: 1, name: 'MacBook Pro 16"', sku: 'ELEC-001', category: 'Electronics', categoryId: 1, price: 150, deposit: 500, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', status: 'available', totalQty: 10, availableQty: 7, reservedQty: 2, damagedQty: 1, description: 'Apple MacBook Pro 16-inch with M3 chip', rating: 4.8, totalRentals: 45 },
  { id: 2, name: 'Canon EOS R5', sku: 'ELEC-002', category: 'Electronics', categoryId: 1, price: 200, deposit: 800, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300', status: 'available', totalQty: 5, availableQty: 3, reservedQty: 2, damagedQty: 0, description: 'Professional mirrorless camera', rating: 4.9, totalRentals: 38 },
  { id: 3, name: 'Sony A7IV', sku: 'ELEC-003', category: 'Electronics', categoryId: 1, price: 180, deposit: 700, image: 'https://images.unsplash.com/photo-1606986628253-49e2e4f0ee04?w=300', status: 'available', totalQty: 4, availableQty: 2, reservedQty: 1, damagedQty: 1, description: 'Full-frame mirrorless camera', rating: 4.7, totalRentals: 32 },
  { id: 4, name: '4K Projector', sku: 'ELEC-004', category: 'Electronics', categoryId: 1, price: 120, deposit: 400, image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=300', status: 'available', totalQty: 8, availableQty: 5, reservedQty: 3, damagedQty: 0, description: 'Epson 4K UHD projector for events', rating: 4.5, totalRentals: 56 },
  { id: 5, name: 'Dell Monitor 27"', sku: 'ELEC-005', category: 'Electronics', categoryId: 1, price: 50, deposit: 200, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300', status: 'available', totalQty: 15, availableQty: 10, reservedQty: 4, damagedQty: 1, description: '27-inch 4K UHD monitor', rating: 4.3, totalRentals: 67 },
  { id: 6, name: 'Executive Desk', sku: 'FURN-001', category: 'Furniture', categoryId: 2, price: 45, deposit: 150, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300', status: 'available', totalQty: 20, availableQty: 14, reservedQty: 5, damagedQty: 1, description: 'Premium executive office desk', rating: 4.4, totalRentals: 89 },
  { id: 7, name: 'Ergonomic Chair', sku: 'FURN-002', category: 'Furniture', categoryId: 2, price: 35, deposit: 100, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300', status: 'available', totalQty: 30, availableQty: 22, reservedQty: 6, damagedQty: 2, description: 'Herman Miller style ergonomic chair', rating: 4.6, totalRentals: 112 },
  { id: 8, name: 'Folding Table 6ft', sku: 'FURN-003', category: 'Furniture', categoryId: 2, price: 20, deposit: 50, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', status: 'available', totalQty: 50, availableQty: 35, reservedQty: 12, damagedQty: 3, description: '6-foot folding table for events', rating: 4.2, totalRentals: 156 },
  { id: 9, name: 'Banquet Chair', sku: 'FURN-004', category: 'Furniture', categoryId: 2, price: 8, deposit: 20, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300', status: 'available', totalQty: 100, availableQty: 65, reservedQty: 30, damagedQty: 5, description: 'Stackable banquet chair with cushion', rating: 4.0, totalRentals: 234 },
  { id: 10, name: 'Toyota Camry 2024', sku: 'VEH-001', category: 'Vehicles', categoryId: 3, price: 85, deposit: 1000, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300', status: 'available', totalQty: 5, availableQty: 3, reservedQty: 2, damagedQty: 0, description: 'Sedan — automatic transmission', rating: 4.7, totalRentals: 78 },
  { id: 11, name: 'Honda CR-V', sku: 'VEH-002', category: 'Vehicles', categoryId: 3, price: 95, deposit: 1200, image: 'https://images.unsplash.com/photo-1568844293986-8d0400f4f36b?w=300', status: 'rented', totalQty: 3, availableQty: 0, reservedQty: 3, damagedQty: 0, description: 'SUV — perfect for family trips', rating: 4.8, totalRentals: 45 },
  { id: 12, name: 'Cargo Van', sku: 'VEH-003', category: 'Vehicles', categoryId: 3, price: 120, deposit: 1500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300', status: 'available', totalQty: 4, availableQty: 2, reservedQty: 1, damagedQty: 1, description: 'Large cargo van for moving', rating: 4.3, totalRentals: 34 },
  { id: 13, name: 'Bosch Drill Set', sku: 'TOOL-001', category: 'Tools', categoryId: 4, price: 25, deposit: 80, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300', status: 'available', totalQty: 12, availableQty: 8, reservedQty: 3, damagedQty: 1, description: 'Professional cordless drill set', rating: 4.5, totalRentals: 89 },
  { id: 14, name: 'Pressure Washer', sku: 'TOOL-002', category: 'Tools', categoryId: 4, price: 55, deposit: 200, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300', status: 'available', totalQty: 6, availableQty: 4, reservedQty: 2, damagedQty: 0, description: 'High-pressure washer 3000 PSI', rating: 4.6, totalRentals: 67 },
  { id: 15, name: 'Generator 5000W', sku: 'TOOL-003', category: 'Tools', categoryId: 4, price: 75, deposit: 300, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300', status: 'maintenance', totalQty: 4, availableQty: 1, reservedQty: 1, damagedQty: 2, description: 'Portable generator for events', rating: 4.4, totalRentals: 45 },
  { id: 16, name: 'PA System 1000W', sku: 'AV-001', category: 'Audio/Visual', categoryId: 5, price: 90, deposit: 350, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300', status: 'available', totalQty: 6, availableQty: 4, reservedQty: 2, damagedQty: 0, description: 'Professional PA system with speakers', rating: 4.7, totalRentals: 78 },
  { id: 17, name: 'LED Stage Lights', sku: 'AV-002', category: 'Audio/Visual', categoryId: 5, price: 60, deposit: 200, image: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=300', status: 'available', totalQty: 10, availableQty: 6, reservedQty: 3, damagedQty: 1, description: 'RGB LED stage lighting set', rating: 4.5, totalRentals: 92 },
  { id: 18, name: 'Wireless Mic Set', sku: 'AV-003', category: 'Audio/Visual', categoryId: 5, price: 40, deposit: 120, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300', status: 'available', totalQty: 8, availableQty: 5, reservedQty: 2, damagedQty: 1, description: 'Dual wireless microphone system', rating: 4.6, totalRentals: 103 },
  { id: 19, name: '4-Person Tent', sku: 'CAMP-001', category: 'Camping', categoryId: 6, price: 30, deposit: 100, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300', status: 'available', totalQty: 15, availableQty: 10, reservedQty: 4, damagedQty: 1, description: 'Waterproof 4-person camping tent', rating: 4.3, totalRentals: 67 },
  { id: 20, name: 'Party Light Set', sku: 'PARTY-001', category: 'Party Supplies', categoryId: 7, price: 35, deposit: 80, image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300', status: 'available', totalQty: 20, availableQty: 14, reservedQty: 5, damagedQty: 1, description: 'String lights and decorative set', rating: 4.4, totalRentals: 134 },
];

// Customers
export const customers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', address: '123 MG Road, Mumbai', avatar: null, status: 'active', totalRentals: 12, totalSpent: 15600, joinDate: '2025-01-20', lastRental: '2026-07-10' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', address: '45 Nehru Nagar, Delhi', avatar: null, status: 'active', totalRentals: 8, totalSpent: 9800, joinDate: '2025-02-15', lastRental: '2026-07-12' },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '+91 76543 21098', address: '78 SG Highway, Ahmedabad', avatar: null, status: 'active', totalRentals: 15, totalSpent: 22400, joinDate: '2025-01-10', lastRental: '2026-07-15' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 65432 10987', address: '12 Banjara Hills, Hyderabad', avatar: null, status: 'active', totalRentals: 6, totalSpent: 7200, joinDate: '2025-03-05', lastRental: '2026-07-08' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 54321 09876', address: '56 Civil Lines, Jaipur', avatar: null, status: 'inactive', totalRentals: 3, totalSpent: 4500, joinDate: '2025-04-20', lastRental: '2026-05-15' },
  { id: 6, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 43210 98765', address: '89 Gomti Nagar, Lucknow', avatar: null, status: 'active', totalRentals: 10, totalSpent: 13200, joinDate: '2025-02-01', lastRental: '2026-07-14' },
  { id: 7, name: 'Arjun Nair', email: 'arjun@example.com', phone: '+91 32109 87654', address: '34 Marine Drive, Kochi', avatar: null, status: 'active', totalRentals: 7, totalSpent: 8900, joinDate: '2025-03-15', lastRental: '2026-07-11' },
  { id: 8, name: 'Kavita Joshi', email: 'kavita@example.com', phone: '+91 21098 76543', address: '67 FC Road, Pune', avatar: null, status: 'active', totalRentals: 14, totalSpent: 18700, joinDate: '2025-01-25', lastRental: '2026-07-16' },
  { id: 9, name: 'Ravi Teja', email: 'ravi@example.com', phone: '+91 10987 65432', address: '90 Tank Bund, Hyderabad', avatar: null, status: 'blocked', totalRentals: 2, totalSpent: 2800, joinDate: '2025-05-10', lastRental: '2026-04-20' },
  { id: 10, name: 'Divya Menon', email: 'divya@example.com', phone: '+91 09876 54321', address: '23 Residency Road, Bangalore', avatar: null, status: 'active', totalRentals: 9, totalSpent: 11500, joinDate: '2025-02-20', lastRental: '2026-07-13' },
  { id: 11, name: 'Suresh Babu', email: 'suresh@example.com', phone: '+91 98712 34567', address: '45 Anna Nagar, Chennai', avatar: null, status: 'active', totalRentals: 11, totalSpent: 14300, joinDate: '2025-01-30', lastRental: '2026-07-09' },
  { id: 12, name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 87612 34567', address: '78 Koramangala, Bangalore', avatar: null, status: 'active', totalRentals: 5, totalSpent: 6700, joinDate: '2025-04-01', lastRental: '2026-07-07' },
];

// Rental Orders
export const rentals = [
  { id: 'RNT-001', customerId: 1, customerName: 'Rajesh Kumar', products: [{ name: 'MacBook Pro 16"', qty: 1, price: 150 }], startDate: '2026-07-10', endDate: '2026-07-17', status: 'active', totalAmount: 1050, deposit: 500, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-002', customerId: 2, customerName: 'Priya Sharma', products: [{ name: 'Canon EOS R5', qty: 1, price: 200 }, { name: 'Wireless Mic Set', qty: 2, price: 40 }], startDate: '2026-07-12', endDate: '2026-07-14', status: 'active', totalAmount: 560, deposit: 920, paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'RNT-003', customerId: 3, customerName: 'Amit Patel', products: [{ name: 'Folding Table 6ft', qty: 10, price: 20 }, { name: 'Banquet Chair', qty: 30, price: 8 }], startDate: '2026-07-08', endDate: '2026-07-10', status: 'returned', totalAmount: 880, deposit: 1100, paymentStatus: 'paid', paymentMethod: 'cash' },
  { id: 'RNT-004', customerId: 4, customerName: 'Sneha Reddy', products: [{ name: 'PA System 1000W', qty: 1, price: 90 }, { name: 'LED Stage Lights', qty: 2, price: 60 }], startDate: '2026-07-15', endDate: '2026-07-16', status: 'active', totalAmount: 210, deposit: 750, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-005', customerId: 6, customerName: 'Neha Gupta', products: [{ name: 'Toyota Camry 2024', qty: 1, price: 85 }], startDate: '2026-07-14', endDate: '2026-07-21', status: 'active', totalAmount: 595, deposit: 1000, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-006', customerId: 7, customerName: 'Arjun Nair', products: [{ name: '4-Person Tent', qty: 3, price: 30 }], startDate: '2026-07-05', endDate: '2026-07-08', status: 'returned', totalAmount: 270, deposit: 300, paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'RNT-007', customerId: 8, customerName: 'Kavita Joshi', products: [{ name: 'Party Light Set', qty: 5, price: 35 }], startDate: '2026-07-16', endDate: '2026-07-17', status: 'active', totalAmount: 175, deposit: 400, paymentStatus: 'paid', paymentMethod: 'cash' },
  { id: 'RNT-008', customerId: 10, customerName: 'Divya Menon', products: [{ name: 'Ergonomic Chair', qty: 4, price: 35 }, { name: 'Executive Desk', qty: 2, price: 45 }], startDate: '2026-07-01', endDate: '2026-07-05', status: 'returned', totalAmount: 700, deposit: 700, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-009', customerId: 11, customerName: 'Suresh Babu', products: [{ name: 'Bosch Drill Set', qty: 2, price: 25 }, { name: 'Pressure Washer', qty: 1, price: 55 }], startDate: '2026-07-18', endDate: '2026-07-20', status: 'pending', totalAmount: 210, deposit: 360, paymentStatus: 'pending', paymentMethod: 'upi' },
  { id: 'RNT-010', customerId: 12, customerName: 'Meera Iyer', products: [{ name: 'Dell Monitor 27"', qty: 2, price: 50 }], startDate: '2026-07-13', endDate: '2026-07-15', status: 'overdue', totalAmount: 200, deposit: 400, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-011', customerId: 1, customerName: 'Rajesh Kumar', products: [{ name: '4K Projector', qty: 1, price: 120 }], startDate: '2026-06-20', endDate: '2026-06-25', status: 'returned', totalAmount: 600, deposit: 400, paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'RNT-012', customerId: 3, customerName: 'Amit Patel', products: [{ name: 'Cargo Van', qty: 1, price: 120 }], startDate: '2026-07-19', endDate: '2026-07-21', status: 'pending', totalAmount: 240, deposit: 1500, paymentStatus: 'pending', paymentMethod: 'card' },
  { id: 'RNT-013', customerId: 5, customerName: 'Vikram Singh', products: [{ name: 'Generator 5000W', qty: 1, price: 75 }], startDate: '2026-05-10', endDate: '2026-05-12', status: 'cancelled', totalAmount: 150, deposit: 300, paymentStatus: 'refunded', paymentMethod: 'cash' },
  { id: 'RNT-014', customerId: 9, customerName: 'Ravi Teja', products: [{ name: 'Sony A7IV', qty: 1, price: 180 }], startDate: '2026-04-15', endDate: '2026-04-20', status: 'returned', totalAmount: 900, deposit: 700, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'RNT-015', customerId: 2, customerName: 'Priya Sharma', products: [{ name: 'MacBook Pro 16"', qty: 2, price: 150 }], startDate: '2026-07-20', endDate: '2026-07-25', status: 'pending', totalAmount: 1500, deposit: 1000, paymentStatus: 'pending', paymentMethod: 'upi' },
];

// Returns
export const returns = [
  { id: 'RTN-001', rentalId: 'RNT-003', customerName: 'Amit Patel', products: 'Folding Table 6ft (10), Banquet Chair (30)', returnDate: '2026-07-10', condition: 'good', damageNotes: '', depositRefund: 1100, penalty: 0, status: 'completed' },
  { id: 'RTN-002', rentalId: 'RNT-006', customerName: 'Arjun Nair', products: '4-Person Tent (3)', returnDate: '2026-07-08', condition: 'minor_damage', damageNotes: 'Small tear in one tent', depositRefund: 250, penalty: 50, status: 'completed' },
  { id: 'RTN-003', rentalId: 'RNT-008', customerName: 'Divya Menon', products: 'Ergonomic Chair (4), Executive Desk (2)', returnDate: '2026-07-05', condition: 'good', damageNotes: '', depositRefund: 700, penalty: 0, status: 'completed' },
  { id: 'RTN-004', rentalId: 'RNT-011', customerName: 'Rajesh Kumar', products: '4K Projector (1)', returnDate: '2026-06-25', condition: 'good', damageNotes: '', depositRefund: 400, penalty: 0, status: 'completed' },
  { id: 'RTN-005', rentalId: 'RNT-014', customerName: 'Ravi Teja', products: 'Sony A7IV (1)', returnDate: '2026-04-22', condition: 'damaged', damageNotes: 'Lens scratched, body dented', depositRefund: 200, penalty: 500, status: 'completed' },
  { id: 'RTN-006', rentalId: 'RNT-010', customerName: 'Meera Iyer', products: 'Dell Monitor 27" (2)', returnDate: null, condition: null, damageNotes: '', depositRefund: null, penalty: null, status: 'pending' },
];

// Payments
export const payments = [
  { id: 'PAY-001', rentalId: 'RNT-001', customerName: 'Rajesh Kumar', amount: 1550, type: 'rental', method: 'card', status: 'completed', date: '2026-07-10', reference: 'TXN-8742651' },
  { id: 'PAY-002', rentalId: 'RNT-002', customerName: 'Priya Sharma', amount: 1480, type: 'rental', method: 'upi', status: 'completed', date: '2026-07-12', reference: 'UPI-9831254' },
  { id: 'PAY-003', rentalId: 'RNT-003', customerName: 'Amit Patel', amount: 1980, type: 'rental', method: 'cash', status: 'completed', date: '2026-07-08', reference: 'CSH-1124567' },
  { id: 'PAY-004', rentalId: 'RNT-003', customerName: 'Amit Patel', amount: -1100, type: 'deposit_refund', method: 'cash', status: 'completed', date: '2026-07-10', reference: 'REF-3345678' },
  { id: 'PAY-005', rentalId: 'RNT-004', customerName: 'Sneha Reddy', amount: 960, type: 'rental', method: 'card', status: 'completed', date: '2026-07-15', reference: 'TXN-5567890' },
  { id: 'PAY-006', rentalId: 'RNT-005', customerName: 'Neha Gupta', amount: 1595, type: 'rental', method: 'card', status: 'completed', date: '2026-07-14', reference: 'TXN-7789012' },
  { id: 'PAY-007', rentalId: 'RNT-006', customerName: 'Arjun Nair', amount: 570, type: 'rental', method: 'upi', status: 'completed', date: '2026-07-05', reference: 'UPI-2234567' },
  { id: 'PAY-008', rentalId: 'RNT-006', customerName: 'Arjun Nair', amount: -250, type: 'deposit_refund', method: 'upi', status: 'completed', date: '2026-07-08', reference: 'REF-4456789' },
  { id: 'PAY-009', rentalId: 'RNT-007', customerName: 'Kavita Joshi', amount: 575, type: 'rental', method: 'cash', status: 'completed', date: '2026-07-16', reference: 'CSH-6678901' },
  { id: 'PAY-010', rentalId: 'RNT-008', customerName: 'Divya Menon', amount: 1400, type: 'rental', method: 'card', status: 'completed', date: '2026-07-01', reference: 'TXN-8890123' },
  { id: 'PAY-011', rentalId: 'RNT-009', customerName: 'Suresh Babu', amount: 570, type: 'rental', method: 'upi', status: 'pending', date: '2026-07-18', reference: 'UPI-1012345' },
  { id: 'PAY-012', rentalId: 'RNT-014', customerName: 'Ravi Teja', amount: 500, type: 'penalty', method: 'card', status: 'completed', date: '2026-04-22', reference: 'PEN-3456789' },
];

// Dashboard Stats
export const dashboardStats = {
  totalRevenue: 284500,
  revenueChange: 12.5,
  totalOrders: 156,
  ordersChange: 8.3,
  totalCustomers: 89,
  customersChange: 15.2,
  activeRentals: 34,
  activeRentalsChange: -2.1,
  availableInventory: 245,
  inventoryChange: 3.4,
  totalReturns: 98,
  returnsChange: 5.7,
  lateReturns: 7,
  lateReturnsChange: -12.5,
  pendingPayments: 3,
  pendingPaymentsChange: -33.3,
};

// Revenue Data (Monthly)
export const revenueData = [
  { month: 'Jan', revenue: 18500, expenses: 8200, profit: 10300 },
  { month: 'Feb', revenue: 21200, expenses: 9100, profit: 12100 },
  { month: 'Mar', revenue: 19800, expenses: 8800, profit: 11000 },
  { month: 'Apr', revenue: 24500, expenses: 10200, profit: 14300 },
  { month: 'May', revenue: 22300, expenses: 9500, profit: 12800 },
  { month: 'Jun', revenue: 28700, expenses: 11800, profit: 16900 },
  { month: 'Jul', revenue: 32500, expenses: 12500, profit: 20000 },
  { month: 'Aug', revenue: 29800, expenses: 11200, profit: 18600 },
  { month: 'Sep', revenue: 26400, expenses: 10800, profit: 15600 },
  { month: 'Oct', revenue: 31200, expenses: 12000, profit: 19200 },
  { month: 'Nov', revenue: 27600, expenses: 11500, profit: 16100 },
  { month: 'Dec', revenue: 35200, expenses: 13500, profit: 21700 },
];

// Rental Trend (Weekly)
export const rentalTrendData = [
  { week: 'W1', rentals: 12, returns: 8 },
  { week: 'W2', rentals: 18, returns: 14 },
  { week: 'W3', rentals: 15, returns: 11 },
  { week: 'W4', rentals: 22, returns: 16 },
  { week: 'W5', rentals: 19, returns: 15 },
  { week: 'W6', rentals: 25, returns: 20 },
  { week: 'W7', rentals: 28, returns: 22 },
  { week: 'W8', rentals: 24, returns: 19 },
  { week: 'W9', rentals: 30, returns: 25 },
  { week: 'W10', rentals: 27, returns: 21 },
  { week: 'W11', rentals: 32, returns: 26 },
  { week: 'W12', rentals: 35, returns: 28 },
];

// Top Products
export const topProductsData = [
  { name: 'Banquet Chair', rentals: 234, revenue: 14976 },
  { name: 'Folding Table 6ft', rentals: 156, revenue: 24960 },
  { name: 'Party Light Set', rentals: 134, revenue: 37520 },
  { name: 'Ergonomic Chair', rentals: 112, revenue: 31360 },
  { name: 'Wireless Mic Set', rentals: 103, revenue: 32960 },
];

// Category Distribution
export const categoryDistribution = [
  { name: 'Electronics', value: 35, color: '#6366f1' },
  { name: 'Furniture', value: 28, color: '#8b5cf6' },
  { name: 'Vehicles', value: 12, color: '#a78bfa' },
  { name: 'Tools', value: 10, color: '#c4b5fd' },
  { name: 'Audio/Visual', value: 8, color: '#818cf8' },
  { name: 'Camping', value: 4, color: '#a5b4fc' },
  { name: 'Party Supplies', value: 3, color: '#c7d2fe' },
];

// Inventory Status
export const inventoryStatusData = [
  { category: 'Electronics', available: 27, reserved: 12, damaged: 3 },
  { category: 'Furniture', available: 136, reserved: 53, damaged: 11 },
  { category: 'Vehicles', available: 5, reserved: 6, damaged: 1 },
  { category: 'Tools', available: 13, reserved: 6, damaged: 3 },
  { category: 'Audio/Visual', available: 15, reserved: 7, damaged: 2 },
  { category: 'Camping', available: 10, reserved: 4, damaged: 1 },
  { category: 'Party', available: 14, reserved: 5, damaged: 1 },
];

// Recent Activity
export const recentActivity = [
  { id: 1, type: 'rental', message: 'New rental order RNT-015 created by Priya Sharma', time: '2 min ago', icon: 'package' },
  { id: 2, type: 'return', message: 'Return RTN-006 pending for Meera Iyer — Dell Monitor 27"', time: '15 min ago', icon: 'undo' },
  { id: 3, type: 'payment', message: 'Payment of ₹1,595 received from Neha Gupta via Card', time: '1 hour ago', icon: 'credit-card' },
  { id: 4, type: 'customer', message: 'New customer registration: Divya Menon', time: '2 hours ago', icon: 'user-plus' },
  { id: 5, type: 'alert', message: 'Late return alert: RNT-010 — Dell Monitor 27" overdue by 2 days', time: '3 hours ago', icon: 'alert-triangle' },
  { id: 6, type: 'product', message: 'Product "Generator 5000W" moved to maintenance', time: '4 hours ago', icon: 'tool' },
  { id: 7, type: 'rental', message: 'Rental RNT-012 confirmed for Amit Patel — Cargo Van', time: '5 hours ago', icon: 'package' },
  { id: 8, type: 'payment', message: 'Deposit refund of ₹250 processed for Arjun Nair', time: '6 hours ago', icon: 'credit-card' },
  { id: 9, type: 'return', message: 'Return completed: RTN-004 — 4K Projector in good condition', time: '8 hours ago', icon: 'check-circle' },
  { id: 10, type: 'alert', message: 'Penalty of ₹500 charged to Ravi Teja for damaged Sony A7IV', time: '1 day ago', icon: 'alert-triangle' },
];

// Notifications
export const notifications = [
  { id: 1, title: 'Late Return Alert', message: 'RNT-010 is overdue by 2 days', type: 'warning', read: false, time: '3 hours ago' },
  { id: 2, title: 'Payment Pending', message: 'Payment for RNT-009 is pending', type: 'info', read: false, time: '5 hours ago' },
  { id: 3, title: 'New Rental Request', message: 'RNT-015 needs approval', type: 'info', read: false, time: '2 hours ago' },
  { id: 4, title: 'Damage Report', message: 'Sony A7IV returned with damage', type: 'error', read: true, time: '1 day ago' },
  { id: 5, title: 'Inventory Low', message: 'Honda CR-V has 0 available units', type: 'warning', read: true, time: '2 days ago' },
];

// Daily Revenue (last 30 days)
export const dailyRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jul ${i + 1}`,
  revenue: Math.floor(Math.random() * 5000) + 3000,
  orders: Math.floor(Math.random() * 8) + 2,
}));
