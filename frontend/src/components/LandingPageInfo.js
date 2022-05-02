function LandingPageInfo() {

  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      This webpage is displaying the account health based on the amount of collateral that has been provided on <a href="https://app.algofi.org/" className="alert-link">AlgoFi</a>.
      <ul>
        <li>The data presented here are for informational purposes only.</li>
        <li>The data might contain inaccuracies and mistakes.</li>
      </ul>
      <div className="pb-3">The webpage is currently in <span className="fw-bold">Beta</span> version and is only running on <span className="fw-bold">TestNet</span> for now.</div>
      <div>You can create an account and choose which storage addresses you want to watch and you will receive an email every hour if a storage address is in critical health due to high borrow allowance utilisation (ie more than 80%).</div>
    </div>
  )
}

export default LandingPageInfo;
