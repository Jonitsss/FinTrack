import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useFinances(user, year, month) {
  const [goals, setGoals] = useState({ income1: 0, income2: 0, savings_goal: 0, reserve: 0 })
  const [fixedExpenses, setFixedExpenses] = useState([])
  const [variableExpenses, setVariableExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const uid = user.id

    const [goalsRes, fixedRes, varRes] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', uid).eq('year', year).eq('month', month).maybeSingle(),
      supabase.from('fixed_expenses').select('*').eq('user_id', uid).eq('year', year).eq('month', month).order('created_at'),
      supabase.from('variable_expenses').select('*').eq('user_id', uid).eq('year', year).eq('month', month).order('created_at'),
    ])

    if (goalsRes.data) setGoals(goalsRes.data)
    else setGoals({ income1: 0, income2: 0, savings_goal: 0, reserve: 0 })
    setFixedExpenses(fixedRes.data || [])
    setVariableExpenses(varRes.data || [])
    setLoading(false)
  }, [user, year, month])

  useEffect(() => { fetchAll() }, [fetchAll])

  // GOALS
  const saveGoals = async (data) => {
    const uid = user.id
    const payload = { user_id: uid, year, month, ...data, updated_at: new Date().toISOString() }
    const { data: existing } = await supabase.from('goals').select('id').eq('user_id', uid).eq('year', year).eq('month', month).maybeSingle()
    if (existing) {
      await supabase.from('goals').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('goals').insert(payload)
    }
    setGoals(data)
  }

  // FIXED
  const addFixed = async (item) => {
    const { data, error } = await supabase.from('fixed_expenses').insert({
      user_id: user.id, year, month, ...item
    }).select().single()
    if (!error) setFixedExpenses(prev => [...prev, data])
    return error
  }

  const deleteFixed = async (id) => {
    await supabase.from('fixed_expenses').delete().eq('id', id)
    setFixedExpenses(prev => prev.filter(x => x.id !== id))
  }

  // VARIABLE
  const addVariable = async (item) => {
    const { data, error } = await supabase.from('variable_expenses').insert({
      user_id: user.id, year, month, ...item
    }).select().single()
    if (!error) setVariableExpenses(prev => [...prev, data])
    return error
  }

  const deleteVariable = async (id) => {
    await supabase.from('variable_expenses').delete().eq('id', id)
    setVariableExpenses(prev => prev.filter(x => x.id !== id))
  }

  // Timeline: fetch summary for all months of the year
  const fetchYearSummary = useCallback(async () => {
    if (!user) return []
    const uid = user.id
    const [goalsRes, fixedRes, varRes] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', uid).eq('year', year),
      supabase.from('fixed_expenses').select('month, amount').eq('user_id', uid).eq('year', year),
      supabase.from('variable_expenses').select('month, amount').eq('user_id', uid).eq('year', year),
    ])
    const goalsByMonth = {}
    ;(goalsRes.data || []).forEach(g => { goalsByMonth[g.month] = g })

    const fixedByMonth = {}
    ;(fixedRes.data || []).forEach(e => { fixedByMonth[e.month] = (fixedByMonth[e.month] || 0) + Number(e.amount) })

    const varByMonth = {}
    ;(varRes.data || []).forEach(e => { varByMonth[e.month] = (varByMonth[e.month] || 0) + Number(e.amount) })

    return Array.from({ length: 12 }, (_, i) => ({
      month: i,
      goals: goalsByMonth[i] || null,
      totalFixed: fixedByMonth[i] || 0,
      totalVariable: varByMonth[i] || 0,
    }))
  }, [user, year])

  return {
    goals, fixedExpenses, variableExpenses, loading,
    saveGoals, addFixed, deleteFixed, addVariable, deleteVariable,
    fetchYearSummary, refetch: fetchAll,
  }
}
