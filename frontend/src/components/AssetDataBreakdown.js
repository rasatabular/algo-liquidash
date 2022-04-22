import { twoDecimalsPercision } from './utils/utils.js';

// Show the breakdown of the collateral supplied and the
// amount currently borrowed
function AssetDataBreakdown({ assetSymbol, assetData }) {

  // calculate the percentage that has been borrowed from this specific asset
  function borrowedPercent(currentlyBorrowed, maxCanBorrow) {
    let ratio = 0;
    if (maxCanBorrow > 0) {
      ratio = currentlyBorrowed / maxCanBorrow;
    }
    return twoDecimalsPercision(ratio);
  }

  return (
    <div className="border-top pt-2 mb-3">
      <div className="row">
        <div className="col-3">{assetSymbol}</div>
        <div className="col">Collateral Supplied:</div>
        <div className="col">{twoDecimalsPercision(assetData.active_collateral_usd)} USD</div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col">Max Available to Borrow:</div>
        <div className="col">{twoDecimalsPercision(assetData.active_collateral_max_borrow_usd)} USD</div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col">Currently Borrowed:</div>
        <div className="col">{twoDecimalsPercision(assetData.borrow_usd)} USD</div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col">Asset Percentage Borrowed:</div>
        <div className="col">{borrowedPercent(assetData.borrow_usd, assetData.active_collateral_max_borrow_usd)} %</div>
      </div>
      <div className="row"></div>
    </div>
  )
}

export default AssetDataBreakdown;
