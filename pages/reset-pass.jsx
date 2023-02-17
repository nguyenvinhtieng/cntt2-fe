import Link from 'next/link'
import React, { useRef } from 'react'
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux'
import displayToast from '~/utils/displayToast'
import { getMethod, postMethod } from '~/utils/fetchData';
import Head from 'next/head';
function ResetPass() {
  const emailRef = useRef()
  const router = useRouter();
  const dispatch = useDispatch()
  const handleSubmitLogin = async () => {
    // do something
    let email = emailRef.current.value
    if(!email) {
        displayToast("error", "Vui lòng điền đầy đủ thông tin");
        return;
    }
    let res = await getMethod('reset-password?email=' + email);
    const { data } = res;
    if(data.status) {
        displayToast("success", data.message);
        router.push('/login');
    }else {
        displayToast("error", data.message);
    }
  }
  return (
    <div className="container">
        <Head>
        <title>Reset mật khẩu</title>
      </Head>
      <div className="auth-page">
        <h1 className='auth-page__heading'>Reset mật khẩu</h1>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Email</label>
          <input ref={emailRef} type="text" placeholder='Email đăng ký tài khoản của bạn...' />
        </div>
        <div className="auth-page__btn">
          <button className='button button--01' onClick={handleSubmitLogin}>Gửi yêu cầu</button>
        </div>
        <p className="auth-page__note">Bạn đã có tài khoản? 
          <Link href="/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPass
