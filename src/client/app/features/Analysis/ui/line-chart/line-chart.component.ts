import {Component, Input, OnInit} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexGrid, ApexLegend,
  ApexMarkers,
  ApexStroke, ApexTitleSubtitle, ApexTooltip,
  ApexXAxis, ApexYAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import {ChartData, ChartOptions} from "../../data-access/chart-options";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {NgIf} from "@angular/common";

@Component({
  selector: 'line-chart',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgIf
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  constructor(private breakpoint: BreakpointObserver) {}

  @Input() chartData!: ChartData;
  chartOptions: ChartOptions = {} as ChartOptions;
  handsetPortrait: boolean = false;

  ngOnInit(): void {
    this.breakpoint.observe(Breakpoints.HandsetPortrait)
      .subscribe((bpState: BreakpointState) => {
        this.handsetPortrait = bpState.matches;
      });

    const series: ApexAxisChartSeries = this.apexAxisChartSeries(this.chartData);
    const chart: ApexChart = this.apexChart;
    const stroke: ApexStroke = this.apexStroke;
    const dataLabels: ApexDataLabels = this.apexDataLabels;
    const markers: ApexMarkers = {} as ApexMarkers;
    const tooltip: ApexTooltip = {} as ApexTooltip;
    const xaxis: ApexXAxis = this.apexXAxis(this.chartData);
    const yaxis: ApexYAxis = {} as ApexYAxis;
    const grid: ApexGrid = this.apexGrid;
    const legend: ApexLegend = {} as ApexLegend;
    const title: ApexTitleSubtitle = this.apexTitleSubtitle;

    this.chartOptions = { series, chart, xaxis, stroke, dataLabels, markers, tooltip, yaxis, grid, legend, title };
  }

  private get apexChart(): ApexChart {
    return {
      height: 'auto',
      width: '100%',
      type: "line",
      foreColor: 'orange',
      fontFamily: 'Helvetica',
      background: 'white',
      sparkline: {
        //   enabled: true
      },
      dropShadow: {
        enabled: true,
        blur: 20,
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      },
      toolbar: {
        tools: {
          download: false
        }
      }
    } as ApexChart;
  }

  private get apexDataLabels(): ApexDataLabels {
    return {
      enabled: false
    } as ApexDataLabels;
  }

  private apexAxisChartSeries(chartData: ChartData): ApexAxisChartSeries {
    return [...chartData.series];
  }

  private get apexTitleSubtitle(): ApexTitleSubtitle {
    return {
      text: '',
      align: "center"
    } as ApexTitleSubtitle;
  }

  private get apexStroke(): ApexStroke {
    return {
      curve: "smooth"
    } as ApexStroke;
  };

  private get apexGrid(): ApexGrid {
    return {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    } as ApexGrid;
  };

  private apexXAxis(chartData: ChartData): ApexXAxis {
    return {
      title: {
        text: 'Games Ago'
      },
      categories: Array.from({length: chartData.series[0].data.length}, (_, i) => i + 1).reverse()
    } as ApexXAxis;
  };
}
