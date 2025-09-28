// This file serves as the central data storage for your entire system.

let invoices = [];
let receipts = [];
let purchaseInvoices = [];
let vendorPayments = [];
let ledger = [];
let lastInvoiceNumber = 0;
let lastReceiptNumber = 0;

// --- Functions to save and load data from localStorage ---

// Call this function whenever you add a new entry to any array
function saveData() {
    const data = {
        invoices: invoices,
        receipts: receipts,
        purchaseInvoices: purchaseInvoices,
        vendorPayments: vendorPayments,
        ledger: ledger,
        lastInvoiceNumber: lastInvoiceNumber,
        lastReceiptNumber: lastReceiptNumber
    };
    localStorage.setItem('accountingData', JSON.stringify(data));
}

// Call this function at the start of every page to load data
function loadData() {
    const storedData = localStorage.getItem('accountingData');
    if (storedData) {
        const data = JSON.parse(storedData);
        invoices = data.invoices || [];
        receipts = data.receipts || [];
        purchaseInvoices = data.purchaseInvoices || [];
        vendorPayments = data.vendorPayments || [];
        ledger = data.ledger || [];
        lastInvoiceNumber = data.lastInvoiceNumber || 0;
        lastReceiptNumber = data.lastReceiptNumber || 0;
    }
}

// Load data immediately when the file is loaded
loadData();
