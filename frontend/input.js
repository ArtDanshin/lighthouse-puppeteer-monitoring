const Chart = require('chart.js');
const results = require('../results.json');

const ctx = document.getElementById('myChart').getContext('2d');
const fields = Object.keys(results);
new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: results[fields[0]].reverse().map(result => {
      const date = new Date(result.date);
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }),
    datasets: fields.map(field => {
      const c1 = Math.random() * 255;
      const c2 = Math.random() * 255;
      const c3 = Math.random() * 255;

      return {
        label: field,
        backgroundColor: `rgba(${c1}, ${c2}, ${c3}, .1)`,
        borderColor: `rgb(${c1}, ${c2}, ${c3})`,
        data: results[field].reverse().map(result => result.score)
      }
    })
  },

  // Configuration options go here
  options: {}
});

console.log(results);