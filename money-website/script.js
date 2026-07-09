document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calc-btn');
    const initialInput = document.getElementById('initial');
    const monthlyInput = document.getElementById('monthly');
    const rateInput = document.getElementById('rate');
    const yearsInput = document.getElementById('years');
    const resultAmount = document.getElementById('result-amount');
    const resultDetail = document.getElementById('result-detail');

    function calculateCompoundInterest() {
        const P = parseFloat(initialInput.value) || 0;
        const M = parseFloat(monthlyInput.value) || 0;
        const r = (parseFloat(rateInput.value) || 0) / 100;
        const t = parseInt(yearsInput.value) || 1;
        const n = 12; // monthly compounding

        // Future value of initial deposit: P * (1 + r/n)^(n*t)
        const initialFV = P * Math.pow(1 + r / n, n * t);

        // Future value of monthly contributions: M * [((1 + r/n)^(n*t) - 1) / (r/n)]
        let monthlyFV = 0;
        if (r > 0) {
            monthlyFV = M * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
        } else {
            monthlyFV = M * n * t; // no interest, just sum of contributions
        }

        const total = initialFV + monthlyFV;
        const totalContributions = P + M * n * t;

        resultAmount.textContent = `$${total.toFixed(2)}`;
        resultDetail.textContent = `Total contributions: $${totalContributions.toFixed(2)} | Interest earned: $${(total - totalContributions).toFixed(2)}`;
    }

    calcBtn.addEventListener('click', calculateCompoundInterest);

    // Calculate on page load with default values
    calculateCompoundInterest();
});