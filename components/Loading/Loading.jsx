import { useSelector } from 'react-redux'
export default function Loading() {
    const appState = useSelector(state => state.appState)
    const { loading } = appState
  return (
    <>
        {loading && 
        <div className="loading__wrapper">
            <div className="loading">
                <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </div>}
    </>
  )
}
