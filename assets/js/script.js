const input = document.querySelector("#clp-input");
const searchBtn = document.querySelector(".search-btn");
const convertedAmount = document.querySelector(".result");
const choiceParent = document.querySelector("#currency-select");
let displayChart;
async function getdata() {
  try {
    const res = await fetch(`https://mindicador.cl/api/${choiceParent.value}`);
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

function formatCurrency(number) {
  const currencies = [
    { name: "uf", code: "es-CL", currency: "CLF" },
    { name: "dolar", code: "en-US", currency: "USD" },
    { name: "euro", code: "de-DE", currency: "EUR" },
  ];
  const currencyUnit = currencies.filter(
    (datum) => datum.name === choiceParent.value
  );
  const [{ code, currency }] = currencyUnit;
  const formattedCurrency = new Intl.NumberFormat(`${code}`, {
    style: "currency",
    currency: `${currency}`,
  }).format(number);
  return formattedCurrency;
}

async function carryOutCalculation() {
  try {
    const value = await getdata();
    const latestTenValues = value.serie.map((val) => {
      return val.valor;
    });
    const enteredValue = +input.value;
    const [latestValue] = latestTenValues;
    const calc = enteredValue / latestValue;
    convertedAmount.innerHTML = `Resultado: ${formatCurrency(calc)}`;
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
          label: `${choiceParent.value}: Historial últimos 10 días `,
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

function clearChart(chart) {
  if (chart) {
    chart.destroy();
  }
}

async function renderChart() {
  try {
    const value = await getdata();
    const chart = document.getElementById("chart").getContext("2d");
    const config = getChartData(value);
    clearChart(displayChart);
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
    formatCurrency();
    chart.style.backgroundColor = "white";
  } else if (input.value === "" || isNaN(input.value)) {
    alert("Ingresa un valor valido");
  } else {
    convertedAmount.innerHTML = `...`;
  }
});
