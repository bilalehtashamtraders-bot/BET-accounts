// data.js (UPDATED - auto-save proxies + reactive counters + helpers)
(function (window) {
  'use strict';

  // ---------------------------
  // Internal counters (private)
  // ---------------------------
  let _lastInvoiceNumber = 133;
  let _lastReceiptNumber = 133;
  let _lastPurchaseInvoiceNumber = 133;
  let _lastVendorPaymentNumber = 133;
  let _lastJournalEntryNumber = 133;

  // ---------------------------
  // In-memory arrays (will become proxied)
  // ---------------------------
  let invoices = [];
  let purchaseInvoices = [];
  let receipts = [];
  let vendorPayments = [];
  let journalEntries = [];

  let ledger = []; // general ledger
  let documents = []; // central documents array

  // ---------------------------
  // Utility: Create proxied array that auto-saves
  // ---------------------------
  function createPersistentArray(keyName, initialArray) {
    const arr = Array.isArray(initialArray) ? initialArray.slice() : [];
    const mutatingMethods = [
      'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin'
    ];

    const handler = {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        // intercept mutating methods to trigger save
        if (typeof value === 'function' && mutatingMethods.includes(prop)) {
          return function (...args) {
            const result = Array.prototype[prop].apply(target, args);
            saveData(); // auto-save after any mutating operation
            return result;
          };
        }
        return value;
      },
      set(target, prop, value, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        // trigger save when numeric indices or length change
        if (!isNaN(prop) || prop === 'length') {
          saveData();
        }
        return result;
      }
    };

    return new Proxy(arr, handler);
  }

  // ---------------------------
  // Local Storage Save / Load
  // ---------------------------
  function saveData() {
    try {
      // save counters
      localStorage.setItem('lastInvoiceNumber', String(_lastInvoiceNumber));
      localStorage.setItem('lastReceiptNumber', String(_lastReceiptNumber));
      localStorage.setItem('lastPurchaseInvoiceNumber', String(_lastPurchaseInvoiceNumber));
      localStorage.setItem('lastVendorPaymentNumber', String(_lastVendorPaymentNumber));
      localStorage.setItem('lastJournalEntryNumber', String(_lastJournalEntryNumber));

      // save arrays (they may be proxies but stringify will use the underlying array)
      localStorage.setItem('invoices', JSON.stringify(invoices));
      localStorage.setItem('purchaseInvoices', JSON.stringify(purchaseInvoices));
      localStorage.setItem('receipts', JSON.stringify(receipts));
      localStorage.setItem('vendorPayments', JSON.stringify(vendorPayments));
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
      localStorage.setItem('ledger', JSON.stringify(ledger));
      localStorage.setItem('documents', JSON.stringify(documents));

      // small debug (comment out in production if noisy)
      // console.log('[data.js] Data saved to localStorage.');
    } catch (e) {
      console.error('[data.js] Failed to save data to localStorage:', e);
    }
  }

  function loadData() {
    try {
      // Load counters (fallback to defaults)
      const li = parseInt(localStorage.getItem('lastInvoiceNumber'));
      _lastInvoiceNumber = Number.isFinite(li) ? li : 133;

      const lr = parseInt(localStorage.getItem('lastReceiptNumber'));
      _lastReceiptNumber = Number.isFinite(lr) ? lr : 133;

      const lp = parseInt(localStorage.getItem('lastPurchaseInvoiceNumber'));
      _lastPurchaseInvoiceNumber = Number.isFinite(lp) ? lp : 133;

      const lv = parseInt(localStorage.getItem('lastVendorPaymentNumber'));
      _lastVendorPaymentNumber = Number.isFinite(lv) ? lv : 133;

      const lj = parseInt(localStorage.getItem('lastJournalEntryNumber'));
      _lastJournalEntryNumber = Number.isFinite(lj) ? lj : 133;

      // Load arrays (parse JSON or []), then wrap with proxies
      const invData = JSON.parse(localStorage.getItem('invoices') || '[]');
      const pInvData = JSON.parse(localStorage.getItem('purchaseInvoices') || '[]');
      const recData = JSON.parse(localStorage.getItem('receipts') || '[]');
      const vpData = JSON.parse(localStorage.getItem('vendorPayments') || '[]');
      const jData = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const ledgerData = JSON.parse(localStorage.getItem('ledger') || '[]');
      const documentsData = JSON.parse(localStorage.getItem('documents') || '[]');

      // create proxied arrays so future mutations auto-save
      invoices = createPersistentArray('invoices', invData);
      purchaseInvoices = createPersistentArray('purchaseInvoices', pInvData);
      receipts = createPersistentArray('receipts', recData);
      vendorPayments = createPersistentArray('vendorPayments', vpData);
      journalEntries = createPersistentArray('journalEntries', jData);
      ledger = createPersistentArray('ledger', ledgerData);
      documents = createPersistentArray('documents', documentsData);

      // console.log('[data.js] Data loaded from localStorage.');
    } catch (e) {
      console.error('[data.js] Failed to load data from localStorage:', e);
      // ensure we still have proxied arrays even if parse fails
      invoices = createPersistentArray('invoices', []);
      purchaseInvoices = createPersistentArray('purchaseInvoices', []);
      receipts = createPersistentArray('receipts', []);
      vendorPayments = createPersistentArray('vendorPayments', []);
      journalEntries = createPersistentArray('journalEntries', []);
      ledger = createPersistentArray('ledger', []);
      documents = createPersistentArray('documents', []);
    }
  }

  // Run load immediately
  loadData();

  // ---------------------------
  // Reactive window-level counters (so existing code using `lastInvoiceNumber` keeps working)
  // ---------------------------
  Object.defineProperty(window, 'lastInvoiceNumber', {
    configurable: true,
    enumerable: true,
    get: function () {
      return _lastInvoiceNumber;
    },
    set: function (v) {
      const n = parseInt(v);
      if (Number.isFinite(n)) {
        _lastInvoiceNumber = n;
        saveData();
      }
    }
  });

  Object.defineProperty(window, 'lastReceiptNumber', {
    configurable: true,
    enumerable: true,
    get: function () {
      return _lastReceiptNumber;
    },
    set: function (v) {
      const n = parseInt(v);
      if (Number.isFinite(n)) {
        _lastReceiptNumber = n;
        saveData();
      }
    }
  });

  Object.defineProperty(window, 'lastPurchaseInvoiceNumber', {
    configurable: true,
    enumerable: true,
    get: function () {
      return _lastPurchaseInvoiceNumber;
    },
    set: function (v) {
      const n = parseInt(v);
      if (Number.isFinite(n)) {
        _lastPurchaseInvoiceNumber = n;
        saveData();
      }
    }
  });

  Object.defineProperty(window, 'lastVendorPaymentNumber', {
    configurable: true,
    enumerable: true,
    get: function () {
      return _lastVendorPaymentNumber;
    },
    set: function (v) {
      const n = parseInt(v);
      if (Number.isFinite(n)) {
        _lastVendorPaymentNumber = n;
        saveData();
      }
    }
  });

  Object.defineProperty(window, 'lastJournalEntryNumber', {
    configurable: true,
    enumerable: true,
    get: function () {
      return _lastJournalEntryNumber;
    },
    set: function (v) {
      const n = parseInt(v);
      if (Number.isFinite(n)) {
        _lastJournalEntryNumber = n;
        saveData();
      }
    }
  });

  // ---------------------------
  // Helper creation functions (use these to add documents)
  // These will: set the number, push to arrays, add to documents & ledger, and auto-save
  // ---------------------------
  function getNextInvoiceNumber() {
    _lastInvoiceNumber = (_lastInvoiceNumber || 133) + 1;
    saveData();
    return _lastInvoiceNumber;
  }

  function addInvoice(invoice) {
    // expect invoice = { date, customer, items: [...], amount, notes, ... }
    invoice.number = invoice.number || getNextInvoiceNumber();
    invoices.push(invoice);
    documents.push(Object.assign({ type: 'invoice', number: invoice.number, date: invoice.date }, invoice));
    // minimal ledger entry, adapt as you need
    ledger.push({ docType: 'invoice', number: invoice.number, amount: invoice.amount || 0, date: invoice.date || new Date().toISOString() });
    // saveData() will be triggered by proxy push
    return invoice;
  }

  function addReceipt(receipt) {
    receipt.number = receipt.number || ((_lastReceiptNumber = _lastReceiptNumber + 1), _lastReceiptNumber);
    receipts.push(receipt);
    documents.push(Object.assign({ type: 'receipt', number: receipt.number, date: receipt.date }, receipt));
    ledger.push({ docType: 'receipt', number: receipt.number, amount: receipt.amount || 0, date: receipt.date || new Date().toISOString() });
    return receipt;
  }

  function addPurchaseInvoice(pi) {
    pi.number = pi.number || ((_lastPurchaseInvoiceNumber = _lastPurchaseInvoiceNumber + 1), _lastPurchaseInvoiceNumber);
    purchaseInvoices.push(pi);
    documents.push(Object.assign({ type: 'purchaseInvoice', number: pi.number, date: pi.date }, pi));
    ledger.push({ docType: 'purchaseInvoice', number: pi.number, amount: pi.amount || 0, date: pi.date || new Date().toISOString() });
    return pi;
  }

  function addVendorPayment(vp) {
    vp.number = vp.number || ((_lastVendorPaymentNumber = _lastVendorPaymentNumber + 1), _lastVendorPaymentNumber);
    vendorPayments.push(vp);
    documents.push(Object.assign({ type: 'vendorPayment', number: vp.number, date: vp.date }, vp));
    ledger.push({ docType: 'vendorPayment', number: vp.number, amount: vp.amount || 0, date: vp.date || new Date().toISOString() });
    return vp;
  }

  function addJournalEntry(entry) {
    entry.number = entry.number || ((_lastJournalEntryNumber = _lastJournalEntryNumber + 1), _lastJournalEntryNumber);
    journalEntries.push(entry);
    documents.push(Object.assign({ type: 'journalEntry', number: entry.number, date: entry.date }, entry));
    ledger.push({ docType: 'journalEntry', number: entry.number, amount: entry.amount || 0, date: entry.date || new Date().toISOString() });
    return entry;
  }

  // ---------------------------
  // Backup & Restore (export / import)
  // ---------------------------
  function getAllData() {
    return {
      lastInvoiceNumber: _lastInvoiceNumber,
      lastReceiptNumber: _lastReceiptNumber,
      lastPurchaseInvoiceNumber
