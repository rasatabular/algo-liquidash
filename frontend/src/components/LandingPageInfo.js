function LandingPageInfo() {

  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      This webpage is displaying the account health based on the amount of collateral that has been provided on <a href="https://app.algofi.org/" class="alert-link">AlgoFi</a>.
      <ul>
        <li>The data presented here are for informational purposes only.</li>
        <li>The data might contain inaccuracies and mistakes.</li>
      </ul>
      The webpage is currently in <span className="fw-bold">Beta</span> version and is only running on <span className="fw-bold">TestNet</span> for now.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default LandingPageInfo;
