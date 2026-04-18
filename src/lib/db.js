const now = () => new Date().toISOString()

function getTable(name) {
  try { return JSON.parse(localStorage.getItem(`x1_${name}`) || '[]') } catch { return [] }
}
function setTable(name, data) {
  localStorage.setItem(`x1_${name}`, JSON.stringify(data))
}
function nextId(rows) {
  if (!rows.length) return 1
  return Math.max(...rows.map(r => Number(r.id) || 0)) + 1
}
function parseChecklist(cl) {
  if (Array.isArray(cl)) return cl
  try { return JSON.parse(cl || '[]') } catch { return [] }
}

// ─── Orders ───────────────────────────────────────────────────
export function getOrders() { return getTable('orders') }
export function addOrder(data) {
  const rows = getTable('orders')
  const row = { ...data, id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('orders', [row, ...rows])
  return row
}
export function updateOrder(id, data) {
  const rows = getTable('orders').map(r => r.id === id ? { ...r, ...data, updated_at: now() } : r)
  setTable('orders', rows)
  return rows.find(r => r.id === id)
}
export function deleteOrder(id) {
  setTable('orders', getTable('orders').filter(r => r.id !== id))
}

// ─── Service Records ──────────────────────────────────────────
export function getServiceRecords() { return getTable('service_records') }
export function addServiceRecord(data) {
  const rows = getTable('service_records')
  const row = { ...data, id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('service_records', [row, ...rows])
  return row
}
export function updateServiceRecord(id, data) {
  const rows = getTable('service_records').map(r => r.id === id ? { ...r, ...data, updated_at: now() } : r)
  setTable('service_records', rows)
  return rows.find(r => r.id === id)
}
export function deleteServiceRecord(id) {
  setTable('service_records', getTable('service_records').filter(r => r.id !== id))
}

// ─── Sales Inquiries ──────────────────────────────────────────
export function getSalesInquiries() { return getTable('sales_inquiries') }
export function addSalesInquiry(data) {
  const rows = getTable('sales_inquiries')
  const row = { ...data, id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('sales_inquiries', [row, ...rows])
  return row
}
export function updateSalesInquiry(id, data) {
  const rows = getTable('sales_inquiries').map(r => r.id === id ? { ...r, ...data, updated_at: now() } : r)
  setTable('sales_inquiries', rows)
  return rows.find(r => r.id === id)
}
export function deleteSalesInquiry(id) {
  setTable('sales_inquiries', getTable('sales_inquiries').filter(r => r.id !== id))
}

// ─── QC Tests ─────────────────────────────────────────────────
export function getQCTests() {
  return getTable('qc_tests').map(r => ({ ...r, checklist: parseChecklist(r.checklist) }))
}
export function addQCTest(data) {
  const rows = getTable('qc_tests')
  const row = { ...data, checklist: JSON.stringify(data.checklist || []), id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('qc_tests', [row, ...rows])
  return { ...row, checklist: data.checklist || [] }
}
export function updateQCTest(id, data) {
  const rows = getTable('qc_tests').map(r =>
    r.id === id ? { ...r, ...data, checklist: JSON.stringify(data.checklist || []), updated_at: now() } : r
  )
  setTable('qc_tests', rows)
  const found = rows.find(r => r.id === id)
  return { ...found, checklist: data.checklist || [] }
}
export function deleteQCTest(id) {
  setTable('qc_tests', getTable('qc_tests').filter(r => r.id !== id))
}

// ─── Tasks ────────────────────────────────────────────────────
export function getTasks() { return getTable('tasks') }
export function addTask(data) {
  const rows = getTable('tasks')
  const row = { ...data, id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('tasks', [row, ...rows])
  return row
}
export function updateTask(id, data) {
  const rows = getTable('tasks').map(r => r.id === id ? { ...r, ...data, updated_at: now() } : r)
  setTable('tasks', rows)
  return rows.find(r => r.id === id)
}
export function deleteTask(id) {
  setTable('tasks', getTable('tasks').filter(r => r.id !== id))
}

// ─── Employees ────────────────────────────────────────────────
export function getEmployees() {
  return getTable('employees').map(({ password, ...rest }) => rest)
}
export function addEmployee(data) {
  const rows = getTable('employees')
  if (rows.find(r => r.email.toLowerCase() === data.email.toLowerCase()))
    throw new Error('Email already in use')
  const row = { ...data, email: data.email.toLowerCase(), id: nextId(rows), created_at: now(), updated_at: now() }
  setTable('employees', [...rows, row])
  const { password, ...safe } = row
  return safe
}
export function updateEmployee(id, data) {
  const rows = getTable('employees')
  if (rows.find(r => r.email.toLowerCase() === data.email.toLowerCase() && r.id !== id))
    throw new Error('Email already in use')
  const updated = rows.map(r => r.id === id ? { ...r, ...data, email: data.email.toLowerCase(), updated_at: now() } : r)
  setTable('employees', updated)
  const { password, ...safe } = updated.find(r => r.id === id)
  return safe
}
export function deleteEmployee(id) {
  setTable('employees', getTable('employees').filter(r => r.id !== id))
}
export function loginEmployee(email, password) {
  const emp = getTable('employees').find(r => r.email === email.toLowerCase())
  if (!emp) throw new Error('No employee found with this email')
  if (emp.password !== password) throw new Error('Incorrect password')
  if (emp.status === 'Inactive') throw new Error('Account is inactive. Contact admin.')
  const { password: _, ...safe } = emp
  return safe
}

// ─── Stock ────────────────────────────────────────────────────
export function getStock() { return getTable('stock_items') }
export function importStock(items) {
  const ts = now()
  const rows = items.map((item, i) => ({
    handle: item.handle || '', title: item.title || '', vendor: item.vendor || '',
    type: item.type || '', tags: item.tags || '', sku: item.sku || '',
    qty: Number(item.qty) || 0, price: Number(item.price) || 0,
    mrp: Number(item.mrp) || 0, status: item.status || 'draft',
    id: i + 1, created_at: ts, updated_at: ts,
  }))
  setTable('stock_items', rows)
  return rows.length
}
export function patchStock(id, data) {
  const rows = getTable('stock_items')
  const existing = rows.find(r => r.id === id)
  if (!existing) throw new Error('Item not found')
  const updated = rows.map(r => r.id === id ? { ...r, ...data, updated_at: now() } : r)
  setTable('stock_items', updated)
  return updated.find(r => r.id === id)
}
export function clearStock() { setTable('stock_items', []) }

// ─── Serial Lookup ────────────────────────────────────────────
export function serialLookup(q) {
  const pattern = (q || '').trim().toLowerCase()
  if (!pattern) return { service: [], qc: [], orders: [] }
  return {
    service: getTable('service_records').filter(r => (r.serial_number || '').toLowerCase().includes(pattern)),
    qc: getTable('qc_tests').map(r => ({ ...r, checklist: parseChecklist(r.checklist) }))
      .filter(r => (r.serial_number || '').toLowerCase().includes(pattern)),
    orders: getTable('orders').filter(r => (r.tracking_number || '').toLowerCase().includes(pattern)),
  }
}
