// data.js

// --- COUNTERS (Tracking the last used number for each document type) ---

let lastInvoiceNumber = 133;
let lastReceiptNumber = 133;
let lastPurchaseInvoiceNumber = 133;
let lastVendorPaymentNumber = 133;
let lastJournalEntryNumber = 133; 

// --- DATA ARRAYS (Current state in memory) ---

let invoices = [];
let purchaseInvoices = [];
let receipts = [];
let vendorPayments = [];
let journalEntries = [];

let ledger = []; // This is your general ledger (all transactions)

let documents = []; // This will be your main documents array (used for search/edit)

// --- LOCAL STORAGE FUNCTIONS ---

// This function saves all data to local storage
function saveData() {
    // Save Counters
    localStorage.setItem('lastInvoiceNumber', lastInvoiceNumber);
    localStorage.setItem('lastReceiptNumber', lastReceiptNumber);
    localStorage.setItem('lastPurchaseInvoiceNumber', lastPurchaseInvoiceNumber);
    localStorage.setItem('lastVendorPaymentNumber', lastVendorPaymentNumber);
    localStorage.setItem('lastJournalEntryNumber', lastJournalEntryNumber);
    
    // Save Document Data
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('purchaseInvoices', JSON.stringify(purchaseInvoices));
    localStorage.setItem('receipts', JSON.stringify(receipts));
    localStorage.setItem('vendorPayments', JSON.stringify(vendorPayments));
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

    // Save Core Accounting Arrays
    localStorage.setItem('ledger', JSON.stringify(ledger));
    localStorage.setItem('documents', JSON.stringify(documents));
}

// This function loads all data from local storage
function loadData() {
    // Load Counters (use default 133 if not found)
    lastInvoiceNumber = parseInt(localStorage.getItem('lastInvoiceNumber')) || 133;
    lastReceiptNumber = parseInt(localStorage.getItem('lastReceiptNumber')) || 133;
    lastPurchaseInvoiceNumber = parseInt(localStorage.getItem('lastPurchaseInvoiceNumber')) || 133;
    lastVendorPaymentNumber = parseInt(localStorage.getItem('lastVendorPaymentNumber')) || 133;
    lastJournalEntryNumber = parseInt(localStorage.getItem('lastJournalEntryNumber')) || 133;

    // Load Document Data (Parse JSON or initialize as empty array)
    invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    purchaseInvoices = JSON.parse(localStorage.getItem('purchaseInvoices')) || [];
    receipts = JSON.parse(localStorage.getItem('receipts')) || [];
    vendorPayments = JSON.parse(localStorage.getItem('vendorPayments')) || [];
    journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    // Load Core Accounting Arrays
    ledger = JSON.parse(localStorage.getItem('ledger')) || [];
    documents = JSON.parse(localStorage.getItem('documents')) || [];
}

// Call loadData immediately to ensure data is available when scripts run
loadData();


// --- BACKUP & RESTORE FUNCTIONS (NEW ADDITION for data security) ---

// Function to compile ALL data into one JSON object for export
function getAllData() {
    return {
        lastInvoiceNumber: lastInvoiceNumber,
        lastReceiptNumber: lastReceiptNumber,
        lastPurchaseInvoiceNumber: lastPurchaseInvoiceNumber,
        lastVendorPaymentNumber: lastVendorPaymentNumber,
        lastJournalEntryNumber: lastJournalEntryNumber,
        invoices: invoices,
        purchaseInvoices: purchaseInvoices,
        receipts: receipts,
        vendorPayments: vendorPayments,
        journalEntries: journalEntries,
        ledger: ledger,
        documents: documents
    };
}

// Function to handle the actual backup file download
function exportData() {
    const data = getAllData();
    const dataStr = JSON.stringify(data, null, 2); 
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element for download
    const a = document.createElement('a');
    a.href = url;
    a.download = `BET_Backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully! Please save the downloaded file to your cloud storage (e.g., Google Drive) immediately.');
}

// Function to handle importing the backup file
function importData(jsonString) {
    if (!confirm("WARNING: Importing data will OVERWRITE all existing data in your current browser session. Do you wish to continue?")) {
        return;
    }
    
    try {
        const data = JSON.parse(jsonString);
        
        // 1. Load Counters
        lastInvoiceNumber = parseInt(data.lastInvoiceNumber) || 133;
        lastReceiptNumber = parseInt(data.lastReceiptNumber) || 133;
        lastPurchaseInvoiceNumber = parseInt(data.lastPurchaseInvoiceNumber) || 133;
        lastVendorPaymentNumber = parseInt(data.lastVendorPaymentNumber) || 133;
        lastJournalEntryNumber = parseInt(data.lastJournalEntryNumber) || 133;

        // 2. Load Arrays
        invoices = data.invoices || [];
        purchaseInvoices = data.purchaseInvoices || [];
        receipts = data.receipts || [];
        vendorPayments = data.vendorPayments || [];
        journalEntries = data.journalEntries || [];
        ledger = data.ledger || [];
        documents = data.documents || [];

        // 3. Save loaded data to Local Storage immediately to persist the change
        saveData();
        
        alert('Data imported and saved successfully! Reloading page to reflect new data.');
        window.location.reload();

    } catch (e) {
        alert('Error parsing backup file. Please ensure the file is the correct .json backup.');
        console.error('Import error:', e);
    }
}
