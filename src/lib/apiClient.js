import * as db from './db'

function parseId(url) {
  const m = url.match(/\/(\d+)$/)
  return m ? parseInt(m[1]) : null
}

function makeError(msg) {
  const err = new Error(msg)
  err.response = { data: { error: msg } }
  return err
}

function wrap(fn) {
  try { return fn() } catch (e) { throw makeError(e.message) }
}

const apiClient = {
  get: async (url) => {
    if (url === '/api/orders') return { data: db.getOrders() }
    if (url === '/api/service_records') return { data: db.getServiceRecords() }
    if (url === '/api/sales_inquiries') return { data: db.getSalesInquiries() }
    if (url === '/api/qc_tests') return { data: db.getQCTests() }
    if (url === '/api/tasks') return { data: db.getTasks() }
    if (url === '/api/employees') return { data: db.getEmployees() }
    if (url === '/api/stock') return { data: db.getStock() }
    if (url.startsWith('/api/serial-lookup')) {
      const q = new URL(url, 'http://x').searchParams.get('q') || ''
      return { data: db.serialLookup(q) }
    }
    throw makeError(`Unknown endpoint: ${url}`)
  },

  post: async (url, body) => {
    if (url === '/api/orders') return { data: wrap(() => db.addOrder(body)) }
    if (url === '/api/service_records') return { data: wrap(() => db.addServiceRecord(body)) }
    if (url === '/api/sales_inquiries') return { data: wrap(() => db.addSalesInquiry(body)) }
    if (url === '/api/qc_tests') return { data: wrap(() => db.addQCTest(body)) }
    if (url === '/api/tasks') return { data: wrap(() => db.addTask(body)) }
    if (url === '/api/employees') return { data: wrap(() => db.addEmployee(body)) }
    if (url === '/api/employees/login') return { data: wrap(() => db.loginEmployee(body.email, body.password)) }
    if (url === '/api/stock/import') return { data: { imported: wrap(() => db.importStock(body)) } }
    throw makeError(`Unknown endpoint: ${url}`)
  },

  put: async (url, body) => {
    const id = parseId(url)
    if (url.startsWith('/api/orders/')) return { data: wrap(() => db.updateOrder(id, body)) }
    if (url.startsWith('/api/service_records/')) return { data: wrap(() => db.updateServiceRecord(id, body)) }
    if (url.startsWith('/api/sales_inquiries/')) return { data: wrap(() => db.updateSalesInquiry(id, body)) }
    if (url.startsWith('/api/qc_tests/')) return { data: wrap(() => db.updateQCTest(id, body)) }
    if (url.startsWith('/api/tasks/')) return { data: wrap(() => db.updateTask(id, body)) }
    if (url.startsWith('/api/employees/')) return { data: wrap(() => db.updateEmployee(id, body)) }
    throw makeError(`Unknown endpoint: ${url}`)
  },

  patch: async (url, body) => {
    const id = parseId(url)
    if (url.startsWith('/api/stock/')) return { data: wrap(() => db.patchStock(id, body)) }
    throw makeError(`Unknown endpoint: ${url}`)
  },

  delete: async (url) => {
    const id = parseId(url)
    if (url.startsWith('/api/orders/')) { db.deleteOrder(id); return { data: { success: true } } }
    if (url.startsWith('/api/service_records/')) { db.deleteServiceRecord(id); return { data: { success: true } } }
    if (url.startsWith('/api/sales_inquiries/')) { db.deleteSalesInquiry(id); return { data: { success: true } } }
    if (url.startsWith('/api/qc_tests/')) { db.deleteQCTest(id); return { data: { success: true } } }
    if (url.startsWith('/api/tasks/')) { db.deleteTask(id); return { data: { success: true } } }
    if (url.startsWith('/api/employees/')) { db.deleteEmployee(id); return { data: { success: true } } }
    if (url === '/api/stock') { db.clearStock(); return { data: { success: true } } }
    throw makeError(`Unknown endpoint: ${url}`)
  },
}

export default apiClient
