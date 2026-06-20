// =============================
// Revenue Forecast Chart
// =============================

const isDarkMode = document.body.classList.contains("dark-mode");

Chart.defaults.color = isDarkMode ? "#ffffff" : "#334155";

Chart.defaults.borderColor = isDarkMode ? "rgba(255,255,255,0.15)" : "#dbe2ea";

const revenueCtx = document.getElementById("revenueChart");

if (revenueCtx) {
  new Chart(revenueCtx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Revenue Forecast",

          data: revenueData,

          borderColor: "#3b82f6",

          backgroundColor: "rgba(59,130,246,0.2)",

          pointBackgroundColor: "#3b82f6",

          borderWidth: 3,

          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? "#ffffff" : "#334155",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: isDarkMode ? "#ffffff" : "#334155",
          },
        },
        y: {
          ticks: {
            color: isDarkMode ? "#ffffff" : "#334155",
          },
        },
      },
    },
  });
}

// =============================
// Channel Contribution Chart
// =============================

let channelChart;

const channelCtx = document.getElementById("channelChart");

if (channelCtx) {
  channelChart = new Chart(channelCtx, {
    type: "pie",
    data: {
      labels: ["Google", "Meta", "Microsoft"],
      datasets: [
        {
          data: [50, 30, 20],

          backgroundColor: ["#3b82f6", "#ec4899", "#f59e0b"],

          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? "#ffffff" : "#334155",
          },
        },
      },
    },
  });
}

// =============================
// Budget Simulator
// =============================

const simulateBtn = document.getElementById("simulateBtn");

if (simulateBtn) {
  simulateBtn.addEventListener("click", function () {
    simulateBtn.innerText = "Generating Forecast...";
    simulateBtn.disabled = true;

    const google = document.getElementById("googleBudget").value;

    const meta = document.getElementById("metaBudget").value;

    const microsoft = document.getElementById("microsoftBudget").value;

    fetch("/simulate", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        google,
        meta,
        microsoft,
      }),
    })
      .then((response) => response.json())

      .then((data) => {
        document.getElementById("simRevenue").innerText =
          "₹ " + Number(data.revenue).toLocaleString("en-IN");

        document.getElementById("simRoas").innerText = data.roas + "x";

        document.getElementById("revLow").innerText =
          "₹ " + Number(data.revenue_low).toLocaleString("en-IN");

        document.getElementById("revExpected").innerText =
          "₹ " + Number(data.revenue).toLocaleString("en-IN");

        document.getElementById("revHigh").innerText =
          "₹ " + Number(data.revenue_high).toLocaleString("en-IN");

        document.getElementById("roasLow").innerText = data.roas_low;

        document.getElementById("roasExpected").innerText = data.roas;

        document.getElementById("roasHigh").innerText = data.roas_high;

        document.getElementById("googleContribution").innerText =
          data.google_percent + "%";

        document.getElementById("metaContribution").innerText =
          data.meta_percent + "%";

        document.getElementById("microsoftContribution").innerText =
          data.microsoft_percent + "%";

        channelChart.data.datasets[0].data = [
          data.google_percent,
          data.meta_percent,
          data.microsoft_percent,
        ];

        channelChart.update();

        const confidence = Math.min(
          95,
          Math.max(70, Math.round(data.roas * 8)),
        );

        document.getElementById("confidenceScore").innerText = confidence + "%";

        document.getElementById("aiInsights").innerHTML = `
        <div class="alert alert-primary">
          <strong>Forecast Summary:</strong><br>
          Expected revenue: ₹ ${Number(data.revenue).toLocaleString("en-IN")}
          <br>
          ROAS: ${data.roas}
        </div>

        <div class="alert alert-info">
          <strong>Key Driver:</strong><br>
          Google Ads receives the highest spend allocation.
        </div>

        <div class="alert alert-warning">
          <strong>Risk:</strong><br>
          Heavy dependence on a single channel.
        </div>

        <div class="alert alert-success">
          <strong>Recommendation:</strong><br>
          Maintain diversification while gradually increasing the best-performing channel budget.
        </div>
        `;

        simulateBtn.innerText = "Simulate Forecast";
        simulateBtn.disabled = false;

        const historyTable = document.getElementById("historyTable");

        const newRow = `
        <tr>
          <td>${data.timestamp}</td>
          <td>₹ ${Number(data.revenue).toLocaleString("en-IN")}</td>
          <td>${data.roas}</td>
        </tr>
        `;

        historyTable.insertAdjacentHTML("afterbegin", newRow);
      })

      .catch((error) => {
        console.error(error);

        simulateBtn.innerText = "Simulate Forecast";
        simulateBtn.disabled = false;

        alert("Simulation failed. Please try again.");
      });
  });
}
