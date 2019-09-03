import * as React from 'react'
import * as d3 from 'd3'
import './bar.css'

export default class DemoBar extends React.Component{
  constructor(props) {
    super(props)

    this.wrapper = React.createRef()
    this.updateBtn = React.createRef()
    this.addBtn = React.createRef()
    this.removeBtn = React.createRef()
  }

  componentDidMount() {
    const wrapper = d3.select(this.wrapper.current)
    
    var names = ['Andy', 'Beth', 'Craig', 'Diane', 'Evelyn', 'Fred', 'Georgia', 'Harry', 'Isabel', 'John'];
    var myData = [];
    var barWidth = 400;
    var barScale = d3.scaleLinear().domain([0, 100]).range([0, barWidth]);

    function randomInteger(n) {
      return Math.floor(10 * Math.random());
    }

    function initialiseData() {
      myData = [
        {
          "name": "Andy",
          "score": 37
        },
        {
          "name": "Beth",
          "score": 39
        },
        {
          "name": "Craig",
          "score": 31
        },
        {
          "name": "Diane",
          "score": 35
        },
        {
          "name": "Evelyn",
          "score": 38
        }
      ];
    }

    function updateBars(data) {
      var u = wrapper
        .selectAll('.person')
        .data(data, function(d) {
          return d.name;
        });

      var entering = u.enter()
        .append('div')
        .classed('person', true);

      entering.append('div')
        .classed('label', true)
        .text(function(d) {
          return d.name;
        });

      entering.append('div')
        .classed('bar', true);

      entering
        .merge(u)
        .select('.bar')
        .transition()
        .style('width', function(d) {
          return barScale(d.score) + 'px';
        });

      u.exit().remove();
    }

    function addPerson() {
      if(myData.length === 10)
        return;

      myData.push({
        name: names[myData.length],
        score: 30 + randomInteger(70)
      });

      update(myData);

    }

    function removePerson() {
      if(myData.length === 0)
        return;

      myData.pop();

      update(myData);
    }

    function updateScores() {
      for(var i = 0; i < myData.length; i++) {
        myData[i].score = 30 + randomInteger(70);
      }

      update(myData);
    }

    function update() {
      updateBars(myData);
    }

    initialiseData();
    update(myData);

    d3.select(this.updateBtn.current).on('click', updateScores)
    d3.select(this.addBtn.current).on('click', addPerson)
    d3.select(this.removeBtn.current).on('click', removePerson)
  }

  render() {
    return (
      <div 
        className="chart chart-border demo-bar"
      >
        <div ref={this.wrapper} className="wrapper" />

        <div className="menu">
          <button ref={this.updateBtn}>Update scores</button>
          <button ref={this.addBtn}>Add person</button>
          <button ref={this.removeBtn}>Remove person</button>
        </div>
      </div>
    )
  }
}