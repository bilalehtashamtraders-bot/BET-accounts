// --- COUNTERS (Tracking the last used number for each document type) ---

let lastInvoiceNumber = 133;
let lastReceiptNumber = 133;
let lastPurchaseInvoiceNumber = 133;
let lastVendorPaymentNumber = 133;
let lastJournalEntryNumber = 133; // CRITICAL: Added for Journal Entries

// --- DATA ARRAYS (Current state in memory) ---

let invoices = [];
let purchaseInvoices = [];
let receipts = [];
let vendorPayments = [];
let journalEntries = []; // CRITICAL: Added for Journal Entries

let ledger = []; // This is your general ledger (all transactions)

let documents = []; // This will be your main documents array (used for search/edit)

// --- SAVE FUNCTION ---
// This function saves all data to local storage
function saveData() {
    // Save Counters
    localStorage.setItem('lastInvoiceNumber', lastInvoiceNumber);
    localStorage.setItem('lastReceiptNumber', lastReceiptNumber);
    localStorage.setItem('lastPurchaseInvoiceNumber', lastPurchaseInvoiceNumber);
    localStorage.setItem('lastVendorPaymentNumber', lastVendorPaymentNumber);
    localStorage.setItem('lastJournalEntryNumber', lastJournalEntryNumber); // CRITICAL: Save Journal Entry Counter
    
    // Save Document Data (Redundant individual arrays, but kept for legacy/specific processes)
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('purchaseInvoices', JSON.stringify(purchaseInvoices));
    localStorage.setItem('receipts', JSON.stringify(receipts));
    localStorage.setItem('vendorPayments', JSON.stringify(vendorPayments));
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries)); // CRITICAL: Save Journal Entries

    // Save Core Accounting Arrays
    localStorage.setItem('ledger', JSON.stringify(ledger));
    localStorage.setItem('documents', JSON.stringify(documents)); // Used by documents.html for searching/editing
}

// --- LOAD FUNCTION ---
// This function loads all data from local storage
function loadData() {
    // Load Counters (use default 133 if not found)
    lastInvoiceNumber = parseInt(localStorage.getItem('lastInvoiceNumber')) || 133;
    lastReceiptNumber = parseInt(localStorage.getItem('lastReceiptNumber')) || 133;
    lastPurchaseInvoiceNumber = parseInt(localStorage.getItem('lastPurchaseInvoiceNumber')) || 133;
    lastVendorPaymentNumber = parseInt(localStorage.getItem('lastVendorPaymentNumber')) || 133;
    lastJournalEntryNumber = parseInt(localStorage.getItem('lastJournalEntryNumber')) || 133; // CRITICAL: Load Journal Entry Counter

    // Load Document Data (Parse JSON or initialize as empty array)
    invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    purchaseInvoices = JSON.parse(localStorage.getItem('purchaseInvoices')) || [];
    receipts = JSON.parse(localStorage.getItem('receipts')) || [];
    vendorPayments = JSON.parse(localStorage.getItem('vendorPayments')) || [];
    journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || []; // CRITICAL: Load Journal Entries

    // Load Core Accounting Arrays
    ledger = JSON.parse(localStorage.getItem('ledger')) || [];
    documents = JSON.parse(localStorage.getItem('documents')) || [];
}

// Call loadData immediately to ensure data is available when scripts run
loadData();
