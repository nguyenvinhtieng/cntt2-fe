import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux'
import displayToast from '~/utils/displayToast'
import { getMethod, postMethod } from '~/utils/fetchData';
function ResetPass() {
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const router = useRouter();
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    // do something
    let password = passwordRef.current.value
    let passwordConfirm = passwordConfirmRef.current.value
    const { slug } = router.query
    if(!slug) {
      router.push('/login');
      return;
    }
    if(!password || !passwordConfirm) {
        displayToast("error", "Vui lòng điền đầy đủ thông tin");
        return;
    }
    if(password !== passwordConfirm) {
        displayToast("error", "Mật khẩu không khớp");
        return;
    }
    if(password.length < 6) {
        displayToast("error", "Mật khẩu phải có ít nhất 6 ký tự");
        return;
    }


    let res = await postMethod('reset-password', {password, token: slug});
    const { data } = res;
    if(data.status) {
      displayToast("success", data.message);
      router.push('/login');
    }else {
      displayToast("error", data.message);
      router.push('/login');
    }
  }
  return (
    <div className="container">
      <div className="auth-page">
        <h1 className='auth-page__heading'>Đổi mật khẩu</h1>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Nhập mật khẩu mới</label>
          <input ref={passwordRef} type="password" placeholder='Mật khẩu mới...' />
        </div>
        <div className="input__wrapper">
          <label className='input__label' htmlFor="">Xác nhận mật khẩu</label>
          <input ref={passwordConfirmRef} type="password" placeholder='Xác nhận mật khẩu...' />
        </div>
        <div className="auth-page__btn">
          <button className='button button--01' onClick={handleSubmit}>Đổi mật khẩu</button>
        </div>
        <p className="auth-page__note">Bạn đã có tài khoản? 
          <Link href="/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPass
