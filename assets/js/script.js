const input = document.querySelector("#clp-input");
const searchBtn = document.querySelector(".search-btn");
const convertedAmount = document.querySelector(".result");
const choiceParent = document.querySelector("#currency-select");
let displayChart;
async function getdata(currency) {
  try {
    const res = await fetch(`https://mindicador.cl/api/${currency}`);
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  } finally {
    console.log("Búsqueda finalizada");
  }
}

function getSelectedCurrency() {
  let value = getdata(choiceParent.value);
  return value;
}

/* function formatCurrency(number) {
  const uf = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLF",
  }).format(number);
  return uf;
} */

async function carryOutCalculation() {
  try {
    const value = await getSelectedCurrency();
    const latestValue = value.serie.map((val) => {
      return val.valor;
    });
    const enteredValue = +input.value;
    const calc = enteredValue / latestValue[0];
    convertedAmount.innerHTML = `Resultado: ${choiceParent.value} ${calc
      .toFixed(2)
      .toLocaleString("es-CL")}`;
  } catch (error) {
    console.log(error.message);
  }
}

function getChartData(value) {
  const slicedArr = value.serie.slice(0, 10);
  const labels = slicedArr.map((label) => label.fecha);
  const data = slicedArr.map((data) => data.valor);
  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Historial últimos 10 días",
          data: data,
          backgroundColor: "black",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    },
  };
  return config;
}

function updateChart(chart) {
  if (chart) {
    chart.destroy();
  }
}

async function renderChart() {
  try {
    const value = await getSelectedCurrency();
    const chart = document.getElementById("chart").getContext("2d");
    const config = getChartData(value);
    /*     if (displayChart) displayChart.destroy(); */
    updateChart(displayChart);
    displayChart = new Chart(chart, config);
  } catch (error) {
    console.log(error.message);
  }
}

searchBtn.addEventListener("click", () => {
  if (
    choiceParent.value !== "choice" &&
    !(isNaN(input.value) || input.value === "")
  ) {
    carryOutCalculation();
    renderChart();
    chart.style.backgroundColor = "white";
  } else if (input.value === "" || isNaN(input.value)) {
    alert("Ingresa un valor valido");
  } else {
    convertedAmount.innerHTML = `...`;
  }
});
