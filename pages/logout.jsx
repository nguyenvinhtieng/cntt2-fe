import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userLogout } from '~/redux/actions/authActions'
export default function logout() {
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(()=> {
    dispatch(userLogout())
    router.push('/')
  }, [])
  return (
    <div>Waitting for logout....</div>
  )
}
