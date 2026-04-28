// Role-to-section access mapping
export const ROLE_ACCESS = {
  'Admin': ['sales', 'service', 'orders', 'qc', 'tasks', 'employees', 'attendance'],
  'Sales Executive': ['sales', 'orders', 'attendance'],
  'Service Technician': ['service', 'orders', 'attendance'],
  'Order Manager': ['orders', 'tasks', 'attendance'],
  'QC Inspector': ['qc', 'attendance'],
  'Design Engineer': ['sales', 'service', 'orders', 'qc', 'tasks', 'attendance'],
  'AI Enabler': ['sales', 'service', 'orders', 'qc', 'tasks', 'attendance'],
  'Other': ['sales', 'service', 'orders', 'qc', 'tasks', 'attendance'],
}

// Get current user from localStorage
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('x1_user') || 'null')
  } catch {
    return null
  }
}

export function isAdmin() {
  return getCurrentUser()?.role === 'Admin'
}

export function getAccessibleSections() {
  const user = getCurrentUser()
  if (!user) return []
  return ROLE_ACCESS[user.role] || []
}

export function canAccess(sectionId) {
  const user = getCurrentUser()
  if (!user) return false
  return (ROLE_ACCESS[user.role] || []).includes(sectionId)
}

// Admin credentials
export const ADMIN_EMAIL = 'admin@x1.com'
const DEFAULT_ADMIN_PASSWORD = 'admin123'

// Module-level variable: initialized from localStorage on first load, updated in memory on change
let _adminPassword = (() => {
  try { return localStorage.getItem('x1_admin_pass') || DEFAULT_ADMIN_PASSWORD } catch { return DEFAULT_ADMIN_PASSWORD }
})()

// Called by Auth.jsx at login time — always returns the current password
export function getAdminPassword() {
  return _adminPassword
}

// Called by Settings when admin changes password — updates both memory and localStorage
export function setAdminPassword(newPassword) {
  _adminPassword = newPassword
  try { localStorage.setItem('x1_admin_pass', newPassword) } catch { /* ignore */ }
}
