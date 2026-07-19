import * as paymentRepository from "../repositories/payment.repository.js";
import * as rentalRepository from "../repositories/rental.repository.js";
import ApiError from "../utils/ApiError.js";

export const createPayment = async (rentalOrderId, amount) => {
  const existing = await paymentRepository.findByRentalOrderId(rentalOrderId);
  if (existing) {
    throw new ApiError(400, "Payment record already exists for this rental order");
  }
  
  const rental = await rentalRepository.findById(rentalOrderId);
  if (!rental) throw new ApiError(404, "Rental order not found");

  const payment = await paymentRepository.create({
    rentalOrderId,
    amount,
    status: "COMPLETED",
    invoiceUrl: `/api/v1/payments/${rentalOrderId}/print`
  });

  await rentalRepository.updateStatus(rentalOrderId, "BOOKED");

  return payment;
};

export const getPayment = async (id) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");
  return payment;
};

export const updatePaymentStatus = async (id, status) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");

  let invoiceUrl = payment.invoiceUrl;
  if (status === "COMPLETED" && !invoiceUrl) {
    invoiceUrl = `/api/v1/payments/${payment.id}/print`;
  }

  return await paymentRepository.updateStatus(id, status, invoiceUrl);
};

export const refundPayment = async (id) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.status !== "COMPLETED") throw new ApiError(400, "Cannot refund a payment that is not completed");

  return await paymentRepository.refund(id);
};

// Generates printable HTML invoice representation
export const getInvoiceHtml = async (id) => {
  let payment = await paymentRepository.findById(id);
  if (!payment) {
    payment = await paymentRepository.findByRentalOrderId(id);
  }
  if (!payment) throw new ApiError(404, "Payment/Rental invoice not found");

  const rental = payment.rentalOrder;
  const user = rental.user;
  const items = rental.items;

  // Calculate pricing summary details
  const gstRate = 0.18; // 18% GST standard
  
  // Late fees and deposits are tracked inside items (Service category) or separate tables
  const depositItem = items.find(item => item.product.barcode === "SECURITY_DEPOSIT_SERVICE");
  const lateFeeItem = items.find(item => item.product.barcode === "LATE_FEES_SERVICE");
  
  const depositAmount = depositItem ? depositItem.pricePerDay : 0;
  const lateFeeAmount = lateFeeItem ? lateFeeItem.pricePerDay : 0;

  // Untaxed regular goods sum
  const regularItems = items.filter(item => 
    item.product.barcode !== "SECURITY_DEPOSIT_SERVICE" && 
    item.product.barcode !== "LATE_FEES_SERVICE"
  );
  
  const totalRegularCost = regularItems.reduce((acc, item) => acc + item.pricePerDay * item.quantity, 0);
  const untaxedAmount = totalRegularCost / (1 + gstRate);
  const gstAmount = totalRegularCost - untaxedAmount;

  const invoiceNo = `INV/2026/${payment.id.substring(0, 8).toUpperCase()}`;
  const formattedDate = new Date(payment.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Pick first vendor if available for the invoice header, fallback to admin
  const firstVendor = regularItems.length > 0 ? regularItems[0].product.vendor : null;
  const companyName = firstVendor?.companyName || "RentFlow Admin Corp";
  const companyLogo = firstVendor?.companyLogo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200";
  const gstNo = firstVendor?.gstNo || "27ADMIN1111A1Z1";

  // HTML responsive layout with tailwind & CSS printing rules
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=initial-scale=1.0">
      <title>Invoice - ${invoiceNo}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body class="bg-gray-100 font-sans p-6 text-gray-800">
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md print:shadow-none print:p-0 print:bg-transparent">
        
        <!-- Action Button -->
        <div class="flex justify-end mb-6 no-print">
          <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md">
            Print Invoice
          </button>
        </div>

        <!-- Header -->
        <div class="flex justify-between border-b pb-6 mb-6">
          <div>
            <img src="${companyLogo}" alt="Logo" class="h-16 w-auto mb-2 object-contain">
            <h1 class="text-2xl font-bold text-gray-900">${companyName}</h1>
            <p class="text-sm text-gray-600">GSTIN: <span class="font-semibold">${gstNo}</span></p>
          </div>
          <div class="text-right">
            <h2 class="text-3xl font-extrabold text-blue-600">INVOICE</h2>
            <p class="text-sm text-gray-600 mt-1">Invoice No: <span class="font-semibold text-gray-950">${invoiceNo}</span></p>
            <p class="text-sm text-gray-600">Date: ${formattedDate}</p>
            <p class="text-sm text-gray-600">Status: <span class="uppercase font-bold ${payment.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}">${payment.status}</span></p>
          </div>
        </div>

        <!-- Addresses -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-xs uppercase font-bold text-gray-400 mb-2">Billing Address</h3>
            <p class="font-semibold text-gray-900">${user.firstName} ${user.lastName}</p>
            <p class="text-sm text-gray-600">${user.phone || "No phone provided"}</p>
            <p class="text-sm text-gray-600">${user.email}</p>
          </div>
          <div class="text-right">
            <h3 class="text-xs uppercase font-bold text-gray-400 mb-2">Rental Interval</h3>
            <p class="text-sm text-gray-900 font-semibold">Start: ${new Date(rental.pickupDate).toLocaleString()}</p>
            <p class="text-sm text-gray-900 font-semibold">End: ${new Date(rental.returnDate).toLocaleString()}</p>
          </div>
        </div>

        <!-- Items Table -->
        <table class="w-full text-left border-collapse mb-8">
          <thead>
            <tr class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <th class="p-3">Product Name</th>
              <th class="p-3 text-center">Qty</th>
              <th class="p-3 text-right">Unit Rate</th>
              <th class="p-3 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody class="divide-y text-sm">
            ${items.map(item => `
              <tr>
                <td class="p-3">
                  <span class="font-semibold text-gray-900">${item.product.name}</span>
                  ${item.product.barcode === "SECURITY_DEPOSIT_SERVICE" ? '<span class="ml-2 text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full font-bold">Deposit</span>' : ''}
                  ${item.product.barcode === "LATE_FEES_SERVICE" ? '<span class="ml-2 text-xs bg-red-100 text-red-800 py-0.5 px-2 rounded-full font-bold">Overdue Penalty</span>' : ''}
                </td>
                <td class="p-3 text-center">${item.quantity}</td>
                <td class="p-3 text-right">$${item.pricePerDay.toFixed(2)}</td>
                <td class="p-3 text-right font-semibold">$${(item.pricePerDay * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Calculation breakdown -->
        <div class="flex justify-end">
          <div class="w-80 space-y-3 text-sm border-t pt-4">
            <div class="flex justify-between text-gray-600">
              <span>Untaxed Amount:</span>
              <span>$${untaxedAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>GST (18%):</span>
              <span>$${gstAmount.toFixed(2)}</span>
            </div>
            ${depositAmount > 0 ? `
              <div class="flex justify-between text-gray-600">
                <span>Security Deposit:</span>
                <span>$${depositAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${lateFeeAmount > 0 ? `
              <div class="flex justify-between text-red-600 font-semibold">
                <span>Late Fee Penalty:</span>
                <span>$${lateFeeAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
              <span>Grand Total:</span>
              <span>$${rental.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer terms -->
        <div class="mt-16 text-center text-xs text-gray-400 border-t pt-6">
          <p>Thank you for renting with ${companyName}! For any issues or support queries, please reach out to billing@rentalflow.com.</p>
        </div>

      </div>

      <!-- Auto print script -->
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 300);
        }
      </script>
    </body>
    </html>
  `;
  return html;
};

export const getAllPayments = async () => {
  return await paymentRepository.findAll();
};
