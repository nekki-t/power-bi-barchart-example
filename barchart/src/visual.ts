
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { select, Selection, scaleBand, scaleLinear, max } from 'd3';

const DUMMY_DATA = [
    {
        value: 10,
        category: 'China'
    },
    {
        value: 8,
        category: 'USA'
    },
    {
        value: 11,
        category: 'India'
    },
    {
        value: 5,
        category: 'Germany'
    },
];

export class Visual implements IVisual {
    private svg: Selection<SVGElement, any, any, any>;
    private barContainer: Selection<SVGElement, any, any, any>;

    constructor(options: VisualConstructorOptions) {
        this.svg = select(options.element)
            .append('svg');

        this.barContainer = this.svg.append('g');
    }

    public update(options: VisualUpdateOptions) {
        const width = options.viewport.width;
        const height = options.viewport.height;

        const x = scaleBand()
            .domain(DUMMY_DATA.map(dataPoint => dataPoint.category))
            .rangeRound([0, width])
            .padding(0.1);

        const y = scaleLinear()
            .domain([0, max(DUMMY_DATA, dataPoint => dataPoint.value) + 2])
            .range([height, 0]);

        this.svg.attr('width', width).attr('height', height);

        const bars = this.barContainer
            .selectAll('.bar')
            .data(DUMMY_DATA);

        bars.enter()
            .append('rect')
            .classed('bar', true)
            .attr('width', x.bandwidth())
            .attr('height', dataPoint => height - y(dataPoint.value))
            .attr('x', dataPoint => x(dataPoint.category))
            .attr('y', dataPoint => y(dataPoint.value));
    }
}