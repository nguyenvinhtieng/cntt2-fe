import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import displayToast from '~/utils/displayToast'
import { postMethod } from '~/utils/fetchData'

function RegisterPage() {
  const router = useRouter()
  const usernameRef = React.useRef()
  const passwordRef = React.useRef()
  const confirmPasswordRef = React.useRef()
  const nameRef = React.useRef()
  const emailRef = React.useRef()
  const handleRegister = async () => {
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const confirmPassword = confirmPasswordRef.current.value
    const name = nameRef.current.value
    const email = emailRef.current.value
    if(!username || !password || !confirmPassword || !name || !email) {
      displayToast('error', 'Vui lòng nhập đầy đủ thông tin')
      return
    }
    if (password !== confirmPassword) {
      displayToast('error', 'Mật khẩu không khớp')
      return
    }

    const res = await postMethod("register", {username, password, name, email})
    const { data } = res
    if(data.status) {
      displayToast('success', 'Đăng ký taì khoản thành công!')
      router.push("/login")
    }else {
      displayToast('error', data.message)
    }
  }  
  return (
    <div className="container">
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>
      <div className="auth-page">
        <h1 className='auth-page__heading'>Đăng ký </h1>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Tên tài khoản</label>
          <input type="text" placeholder='Nhập tên tài khoản của bạn...' ref={usernameRef}/>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Mật khẩu</label>
          <input type="password" placeholder='Tạo mật khẩu của bạn...' ref={passwordRef}/>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nhập lại mật khẩu</label>
          <input type="password" placeholder='Nhập lại mật khẩu của bạn...' ref={confirmPasswordRef} />
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Tên của bạn là</label>
          <input type="text" placeholder='Nhập tên của bạn...' ref={nameRef}/>
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Email</label>
          <input type="email" placeholder='Nhập email của bạn...' ref={emailRef}/>
        </div>
        <div className="auth-page__btn">
          <button className='button button--01' onClick={handleRegister}>Đăng ký</button>
        </div>
        <p className="auth-page__note">Bạn đã có tài khoản? 
          <Link href="/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  )
}
export default RegisterPage