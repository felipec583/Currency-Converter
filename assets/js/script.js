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
  }
}

function getSelectedCurrency() {
  let value = getdata(choiceParent.value);
  return value;
}

function formatCurrency(number) {
  const uf = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLF",
  }).format(number);
  return uf;
}

async function carryOutCalculation() {
  try {
    const value = await getSelectedCurrency();
    const latestValue = value.serie.map((val) => {
      return val.valor;
    });
    const enteredValue = +input.value;
    const calc = enteredValue / latestValue[0];
    convertedAmount.innerHTML = `${choiceParent.value} ${calc
      .toFixed(2)
      .toLocaleString("es-CL")}`;
    console.log(value);
  } catch (error) {
    console.log(error.message);
  }
}

async function renderChart() {
  const chart = document.getElementById("chart").getContext("2d");
  const value = await getSelectedCurrency();
  const slicedArr = value.serie.slice(0, 10);
  console.log(slicedArr);
  const labels = slicedArr.map((label) => label.fecha);
  const data = slicedArr.map((data) => data.valor);
  if (displayChart) displayChart.destroy();
  displayChart = new Chart(chart, {
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
  });
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
