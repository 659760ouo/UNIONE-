// stats_style.js
export const chartStyles = {
  // Global font settings
  font: {
    family: "'Inter', sans-serif",
    size: 12,
    weight: '400'
  },

  // Title styling
  title: {
    display: true,
    text: 'Performance Statistics',
    color: '#2c3e50',
    font: {
      size: 18,
      weight: '600'
    },
    padding: {
      top: 10,
      bottom: 20
    }
  },

  // Legend styling
  legend: {
    position: 'bottom',
    labels: {
      padding: 20,
      usePointStyle: true,
      pointStyle: 'circle',
      color: '#34495e'
    }
  },

  // Tooltip styling
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    titleColor: '#2c3e50',
    bodyColor: '#34495e',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 12,
    boxPadding: 6,
    usePointStyle: true,
    callbacks: {
      label: function(context) {
        return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
      }
    }
  },

  // Grid lines
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#7f8c8d'
      }
    },
    y: {
      grid: {
        color: 'rgba(230, 230, 230, 0.7)'
      },
      ticks: {
        color: '#7f8c8d',
        padding: 10
      },
      beginAtZero: true
    }
  },

  // Animation
  animation: {
    duration: 1500,
    easing: 'easeOutQuart'
  },

  // Dataset styling (bar/line colors)
  datasets: {
    bar: {
      backgroundColor: [
        'rgba(52, 152, 219, 0.7)',
        'rgba(46, 204, 113, 0.7)',
        'rgba(155, 89, 182, 0.7)',
        'rgba(241, 196, 15, 0.7)',
        'rgba(231, 76, 60, 0.7)'
      ],
      borderColor: [
        'rgba(52, 152, 219, 1)',
        'rgba(46, 204, 113, 1)',
        'rgba(155, 89, 182, 1)',
        'rgba(241, 196, 15, 1)',
        'rgba(231, 76, 60, 1)'
      ],
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: [
        'rgba(52, 152, 219, 0.9)',
        'rgba(46, 204, 113, 0.9)',
        'rgba(155, 89, 182, 0.9)',
        'rgba(241, 196, 15, 0.9)',
        'rgba(231, 76, 60, 0.9)'
      ],
      hoverBorderWidth: 3
    },
    line: {
      borderColor: 'rgba(52, 152, 219, 1)',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(52, 152, 219, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  }
};

export default null;