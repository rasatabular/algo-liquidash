// Show the high-level storage account info
import { useContext, useState } from "react";

import AssetDataBreakdown from "./AssetDataBreakdown";

import AuthContextProvider from "./../store/auth-context";

import { twoDecimalsPercision } from './utils/utils.js';

function StorageAccountData({ account, state, prefix, watchHandler, watchButtonText }) {

  let symbols = ['ALGO', 'USDC', 'goBTC', 'goETH', 'STBL', 'vALGO'];

  const CRITICAL_HEALTH = 0.8;

  const authCtx = useContext(AuthContextProvider);

  // critical health color
  let healthClass = 'row ';
  if (state.account_health.percentage_borrowed > CRITICAL_HEALTH) {
    healthClass += 'text-danger'
  }

  // for the "Read More" button
  const [isTextHidden, setIsTextHidden] = useState(true);
  const [isButtonClickable, setIsButtonClickable] = useState(true);

  function handleButtonClick() {
    if (isButtonClickable) {
      setIsButtonClickable(false);
      setTimeout(() => {
        setIsTextHidden((prevButtonValue) => {
          return !prevButtonValue
        });
        setIsButtonClickable(true);
      }, 150);
    }
  }

  const readMoreText = (isTextHidden ? "Read More" : "Hide");

  return (
    <div className='card mb-2 border-1'>
      <div className='card-body row'>
        <div className="row fw-bold">
          <div className='col-4 card-title'>Storage Address:</div>
          <div className="col">{account}</div>
        </div>
        <div className={healthClass}>
          <div className='col-4'>Account Health:</div>
          <div className='col'>{twoDecimalsPercision(state.account_health.percentage_borrowed * 100)}%
            {(state.account_health.percentage_borrowed > CRITICAL_HEALTH)
              && "  - CRITICAL"}</div>
          <div className="col-2">
            {authCtx.isLoggedIn && <button
              onClick={() => watchHandler(account)}
              className="btn btn-primary"
            >{watchButtonText}</button>}
          </div>
        </div>
        <div className="row">
          <div className='col-4'>Account Currently Borrowed:</div>
          <div className='col'>{twoDecimalsPercision(state.account_health.borrowed_usd)}</div>
        </div>
        <div className="row">
          <div className='col-4'>Account Max Borrow:</div>
          <div className='col'>{twoDecimalsPercision(state.account_health.borrow_usd_max)}</div>
        </div>
      </div>
      <div className="row">
        <button
          className='btn btn-link p-0 w-100 text-decoration-none'
          data-bs-toggle="collapse"
          data-bs-target={`#${prefix}-${account}`}
          aria-expanded="false"
          aria-controls={`${prefix}-${account}`}
          type="button"
          onClick={handleButtonClick}>{readMoreText}</button>
      </div>
      <div className="collapse" id={`${prefix}-${account}`}>
        <div className="card card-body">
          {symbols.map(symbol => (
            <AssetDataBreakdown
              key={account + symbol}
              assetSymbol={symbol}
              assetData={state[symbol]}
            />
          ))}
        </div>

      </div>
    </div >
  )
}

export default StorageAccountData;
