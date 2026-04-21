import { useState, useEffect, useCallback } from 'react'
import axios from '../lib/apiClient'

export function useApi(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 30s timeout so pages never hang forever on Supabase cold start
      const res = await Promise.race([
        axios.get(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 30000))
      ])
      setData(res.data)
    } catch (err) {
      console.error('useApi error:', err)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, setData, loading, refetch: fetchData }
}
