import React, { useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import useOnClickOutside from '~/hooks/useClickOutside';

export default function Select({initialVal, onChangeFunc, options}) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);
  const selectRef = React.useRef();
  const [currentVal, setCurrentVal] = useState(initialVal || "--Choose--")
  const handleChangeVal = (option) => {
    setCurrentVal(option.title)
    toggleOpen()
    onChangeFunc(option.value)
  }
  useOnClickOutside(selectRef, ()=>setOpen(false))
  return (
    <div className='inputSlelect' ref={selectRef}>
      <div className='inputSlelect__control' onClick={toggleOpen}>
        <span className="ttl" >{currentVal}</span>
        <span className="ico"><AiFillCaretDown></AiFillCaretDown></span>
      </div>
      <div className={`inputSlelect__menu ${open ? "is-open" : ""}`}>
        {options?.length > 0 && options.map((option, index) => (
          <div key={option.value} className='inputSlelect__menuItem' onClick={()=> handleChangeVal(option)}>
            <span className="ttl">{option.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
