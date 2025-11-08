
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { StoryStep } from '../types';

Chart.register(...registerables);

interface FeelingsChartProps {
  storyData: StoryStep[];
  currentStepIndex: number;
}

const FeelingsChart: React.FC<FeelingsChartProps> = ({ storyData, currentStepIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
    }
    
    const chartDataPoints = storyData.map(step => step.angerLevel);
    const chartLabels = storyData.map((_, i) => `مشهد ${i + 1}`);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'مستوى الغضب',
          data: chartDataPoints,
          borderColor: 'rgb(202, 138, 4)',
          backgroundColor: 'rgba(202, 138, 4, 0.1)',
          tension: 0.3,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: 'rgb(202, 138, 4)',
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            title: {
              display: true,
              text: 'مستوى الغضب (10 = غاضب جداً، 0 = هادئ جداً)',
              font: { family: 'Tajawal', size: 12 }
            }
          },
          x: {
            title: {
              display: true,
              text: 'خطوات القصة',
              font: { family: 'Tajawal', size: 12 }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            rtl: true,
            bodyFont: { family: 'Tajawal' },
            titleFont: { family: 'Tajawal' },
            callbacks: {
              title: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                return storyData[index].title;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyData]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      const chart = chartInstanceRef.current;
      const chartDataPoints = storyData.map(step => step.angerLevel);
      chart.data.datasets[0].pointBackgroundColor = chartDataPoints.map((_, i) => i === currentStepIndex ? '#0d9488' : 'rgb(202, 138, 4)');
      chart.data.datasets[0].pointRadius = chartDataPoints.map((_, i) => i === currentStepIndex ? 8 : 5);
      chart.data.datasets[0].borderWidth = chartDataPoints.map((_, i) => i === currentStepIndex ? 5 : 3);
      chart.update();
    }
  }, [currentStepIndex, storyData]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
      <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 text-center">مؤشر مشاعر كوكو</h3>
      <p className="text-center text-gray-600 mb-4">شاهد كيف يتغير "مستوى الغضب" عند كوكو في كل خطوة!</p>
      <div className="relative w-full max-w-2xl mx-auto h-72 md:h-80">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default FeelingsChart;
